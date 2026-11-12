import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  setDoc,
  onSnapshot, 
  query, 
  serverTimestamp 
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1yEsjLYjplSDISXYAVXNQa8m1kSu-32o",
  authDomain: "myfolio-ce68b.firebaseapp.com",
  projectId: "myfolio-ce68b",
  storageBucket: "myfolio-ce68b.firebasestorage.app",
  messagingSenderId: "246447781534",
  appId: "1:246447781534:web:dc8fe1b38ef0d14239ad8f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const BLOGS_COLLECTION = "blogs";

/**
 * Subscribe to real-time blog updates from Firestore with automatic local storage fallback.
 */
export function subscribeToBlogs(callback) {
  try {
    const blogsRef = collection(db, BLOGS_COLLECTION);
    const q = query(blogsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const blogs = [];
        snapshot.forEach((docSnap) => {
          blogs.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        });

        // Sort newest first
        blogs.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.updatedAt ? new Date(a.updatedAt).getTime() : 0);
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.updatedAt ? new Date(b.updatedAt).getTime() : 0);
          return timeB - timeA;
        });

        // Sync with local cache (only store real Firebase blogs, purge old mock data)
        try {
          localStorage.setItem("os_notes", JSON.stringify(blogs));
        } catch {
          // ignore
        }

        callback(blogs, true);
      },
      (error) => {
        console.warn("Firestore subscription warning:", error.message);
        try {
          const saved = JSON.parse(localStorage.getItem("os_notes") || "[]");
          const realOnly = saved.filter((item) => item.id !== 10 && item.title !== "Hello, Welcome to Mac");
          callback(realOnly, false);
        } catch {
          callback([], false);
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn("Failed to initialize Firestore listener:", error);
    try {
      const saved = JSON.parse(localStorage.getItem("os_notes") || "[]");
      const realOnly = saved.filter((item) => item.id !== 10 && item.title !== "Hello, Welcome to Mac");
      callback(realOnly, false);
    } catch {
      callback([], false);
    }
    return () => {};
  }
}

/**
 * Publish or update a blog post to Firestore & local cache.
 */
export async function saveBlogToFirebase(blogData) {
  const now = new Date().toISOString();
  const blogPayload = {
    title: blogData.title || "Untitled Blog",
    subtitle: blogData.subtitle || "",
    content: blogData.content || "",
    category: blogData.category || "General",
    tags: blogData.tags || ["Portfolio"],
    coverImage: blogData.coverImage || "",
    coverPosition: typeof blogData.coverPosition === "number" ? blogData.coverPosition : (blogData.coverPosition != null ? Number(blogData.coverPosition) : 50),
    status: blogData.status || "published", // "published" | "draft"
    author: blogData.author || "Administrator",
    folder: "notes",
    pinned: Boolean(blogData.pinned),
    date: new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" }),
    updatedAt: now,
  };

  let savedId = blogData.id;
  let remoteSuccess = false;

  try {
    if (blogData.id && typeof blogData.id === "string" && !blogData.id.startsWith("local_")) {
      // Update existing document
      const docRef = doc(db, BLOGS_COLLECTION, String(blogData.id));
      await updateDoc(docRef, {
        ...blogPayload,
        updatedAtServer: serverTimestamp(),
      });
      savedId = blogData.id;
      remoteSuccess = true;
    } else {
      // Add new document
      const docRef = await addDoc(collection(db, BLOGS_COLLECTION), {
        ...blogPayload,
        createdAt: serverTimestamp(),
      });
      savedId = docRef.id;
      remoteSuccess = true;
    }
  } catch (err) {
    console.warn("Firestore save fallback to local storage:", err.message);
    if (!savedId) {
      savedId = "local_" + Date.now();
    }
  }

  // Update local storage cache
  const fullPost = {
    ...blogPayload,
    id: savedId,
  };
  saveLocalBlog(fullPost);

  // Notify Notes app and other windows
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("os_notes_updated", { detail: { blog: fullPost } }));
  }

  return { id: savedId, success: true, remote: remoteSuccess };
}

/**
 * Delete a blog post from Firestore and local cache.
 */
export async function deleteBlogFromFirebase(blogId) {
  try {
    if (blogId && typeof blogId === "string" && !blogId.startsWith("local_")) {
      const docRef = doc(db, BLOGS_COLLECTION, String(blogId));
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.warn("Firestore delete warning:", err.message);
  }

  // Delete from local cache
  deleteLocalBlog(blogId);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("os_notes_updated", { detail: { deletedId: blogId } }));
  }
}

// Local cache helpers
function getLocalBlogs() {
  try {
    const saved = localStorage.getItem("os_notes");
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
}

function saveLocalBlog(blog) {
  try {
    const list = getLocalBlogs();
    const idx = list.findIndex((item) => String(item.id) === String(blog.id));
    let updated;
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = { ...updated[idx], ...blog };
    } else {
      updated = [blog, ...list];
    }
    localStorage.setItem("os_notes", JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function deleteLocalBlog(id) {
  try {
    const list = getLocalBlogs();
    const updated = list.filter((item) => String(item.id) !== String(id));
    localStorage.setItem("os_notes", JSON.stringify(updated));
  } catch {
    // ignore
  }
}

// --------------------------------------------------------------------------
// FIREBASE ADMIN AUTHENTICATION
// --------------------------------------------------------------------------
const AUTH_COLLECTION = "system_auth";
const ADMIN_DOC_ID = "keynote_admin";
const EXPECTED_HASH = "214623f69be80c8f89e87383cb264d9c79802c083079b5e06819611391af9adf";

async function sha256Hash(text) {
  try {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const utf8 = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
      return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch {
    // fallback
  }
  return text;
}

/**
 * Verifies admin password against Firebase Firestore.
 * Does not store password in localStorage for security.
 */
export async function verifyAdminPassword(inputPassword) {
  if (!inputPassword) return false;

  try {
    const inputHash = await sha256Hash(inputPassword);

    // Query Firestore document directly
    const authDocRef = doc(db, AUTH_COLLECTION, ADMIN_DOC_ID);
    const snap = await getDoc(authDocRef);

    if (snap.exists()) {
      const data = snap.data();
      const isValid = 
        data.adminPassword === inputPassword || 
        data.passwordHash === inputHash;
      return isValid;
    } else {
      // If document doesn't exist yet, seed it into Firebase Firestore
      await setDoc(authDocRef, {
        adminPassword: "Abinayanatrajan",
        passwordHash: EXPECTED_HASH,
        updatedAt: new Date().toISOString()
      });
      return inputPassword === "Abinayanatrajan" || inputHash === EXPECTED_HASH;
    }
  } catch (err) {
    console.warn("Firestore auth check warning (using secure hash verification):", err.message);
    const inputHash = await sha256Hash(inputPassword);
    return inputPassword === "Abinayanatrajan" || inputHash === EXPECTED_HASH;
  }
}

/**
 * Updates admin password in Firebase Firestore without storing locally.
 */
export async function updateAdminPasswordInFirebase(newPassword) {
  if (!newPassword) return false;
  const newHash = await sha256Hash(newPassword);

  const authDocRef = doc(db, AUTH_COLLECTION, ADMIN_DOC_ID);
  await setDoc(authDocRef, {
    adminPassword: newPassword,
    passwordHash: newHash,
    updatedAt: new Date().toISOString()
  });
  return true;
}

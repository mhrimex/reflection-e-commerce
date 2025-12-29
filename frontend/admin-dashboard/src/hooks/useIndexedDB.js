
// useIndexedDB.js
// Custom React hook for IndexedDB integration with hybrid API sync
// Usage: const db = useIndexedDB('ecommerce-admin', 'products');

import { useCallback } from 'react';

function openDB(dbName, storeName) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'queueId', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export default function useIndexedDB(dbName = 'ecommerce-admin', storeName = 'products') {
  // Add item to IndexedDB and queue for sync
  const add = useCallback(async (item) => {
    const db = await openDB(dbName, storeName);
    const tx = db.transaction([storeName, 'syncQueue'], 'readwrite');
    const store = tx.objectStore(storeName);
    const queue = tx.objectStore('syncQueue');
    const id = await store.add(item);
    await queue.add({ action: 'add', store: storeName, item: { ...item, id } });
    await tx.done;
    db.close();
    return id;
  }, [dbName, storeName]);

  // Get all items from IndexedDB
  const getAll = useCallback(async () => {
    const db = await openDB(dbName, storeName);
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const items = await store.getAll();
    db.close();
    return items;
  }, [dbName, storeName]);

  // Update item in IndexedDB and queue for sync
  const update = useCallback(async (id, updates) => {
    const db = await openDB(dbName, storeName);
    const tx = db.transaction([storeName, 'syncQueue'], 'readwrite');
    const store = tx.objectStore(storeName);
    const queue = tx.objectStore('syncQueue');
    const item = await store.get(id);
    const updated = { ...item, ...updates };
    await store.put(updated);
    await queue.add({ action: 'update', store: storeName, item: updated });
    await tx.done;
    db.close();
  }, [dbName, storeName]);

  // Remove item from IndexedDB and queue for sync
  const remove = useCallback(async (id) => {
    const db = await openDB(dbName, storeName);
    const tx = db.transaction([storeName, 'syncQueue'], 'readwrite');
    const store = tx.objectStore(storeName);
    const queue = tx.objectStore('syncQueue');
    await store.delete(id);
    await queue.add({ action: 'delete', store: storeName, id });
    await tx.done;
    db.close();
  }, [dbName, storeName]);

  // Sync queued changes to backend API (call this when online)
  const syncQueue = useCallback(async (apiBase, token) => {
    const db = await openDB(dbName, storeName);
    const tx = db.transaction('syncQueue', 'readwrite');
    const queue = tx.objectStore('syncQueue');
    const all = await queue.getAll();
    for (const q of all) {
      let res;
      try {
        if (q.action === 'add') {
          res = await fetch(`${apiBase}/${q.store}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
            body: JSON.stringify(q.item),
          });
        } else if (q.action === 'update') {
          res = await fetch(`${apiBase}/${q.store}/${q.item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
            body: JSON.stringify(q.item),
          });
        } else if (q.action === 'delete') {
          res = await fetch(`${apiBase}/${q.store}/${q.id}`, {
            method: 'DELETE',
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
          });
        }
        if (res && res.ok) {
          await queue.delete(q.queueId);
        }
      } catch (e) {
        // If offline or error, keep in queue
      }
    }
    db.close();
  }, [dbName, storeName]);

  return { add, getAll, update, remove, syncQueue };
}

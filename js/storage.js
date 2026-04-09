// ── Generic localStorage wrapper ───────────────────────────────────
export class Storage {
    constructor(key) {
        this.key = key;
    }

    load() {
        try {
            const raw = localStorage.getItem(this.key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error(`Storage[${this.key}]: parse error`, e);
            return null;
        }
    }

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    // Prepends item to an array stored under this key.
    add(item) {
        const arr = this.load() ?? [];
        arr.unshift(item);
        this.save(arr);
        return arr;
    }

    // Removes an item by id from an array stored under this key.
    remove(id) {
        const arr = this.load() ?? [];
        const next = arr.filter(i => i.id !== id);
        this.save(next);
        return next;
    }

    // Seeds storage only if the key is completely absent (never sets over existing data).
    seedIfEmpty(data) {
        if (localStorage.getItem(this.key) === null) {
            this.save(data);
        }
    }

    clear() {
        localStorage.removeItem(this.key);
    }
}

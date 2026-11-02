
const productContainer = document.querySelector("#daftar-produk");
const emptyMessage = document.querySelector("#pesan-kosong");

// Mengamankan teks sebelum dimasukkan ke HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Menentukan emoji berdasarkan kategori
function getEmoji(category) {
    const emojis = {
        "Sayuran": "🥬",
        "Buah": "🍌",
        "Biji-bijian": "🌽",
        "Umbi-umbian": "🥔"
    };

    return emojis[category] || "🌱";
}

// Menampilkan daftar produk
export function renderProducts(products, events = {}) {
    if (!productContainer) {
        return;
    }

    if (products.length === 0) {
        productContainer.innerHTML = "";

        if (emptyMessage) {
            emptyMessage.hidden = false;
        }

        return;
    }

    if (emptyMessage) {
        emptyMessage.hidden = true;
    }

    productContainer.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-emoji">
                ${getEmoji(product.kategori)}
            </div>

            <span class="product-category">
                ${escapeHTML(product.kategori)}
            </span>

            <h3>${escapeHTML(product.nama)}</h3>

            <p class="product-description">
                ${escapeHTML(product.deskripsi || "Tidak ada deskripsi.")}
            </p>

            <p class="product-price">
                Rp ${Number(product.harga).toLocaleString("id-ID")}
            </p>

            <p class="product-stock">
                Stok: ${escapeHTML(product.stok)}
                ${escapeHTML(product.satuan)}
            </p>

            <div class="product-actions">
                <button
                    type="button"
                    class="btn btn-edit"
                    data-action="edit"
                    data-id="${product.id}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="btn btn-delete"
                    data-action="delete"
                    data-id="${product.id}"
                >
                    Hapus
                </button>
            </div>
        </article>
    `).join("");

    // Menjalankan fungsi edit atau hapus
    productContainer.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", function() {
            const id = Number(this.dataset.id);
            const action = this.dataset.action;

            if (action === "edit" && events.onEdit) {
                events.onEdit(id);
            }

            if (action === "delete" && events.onDelete) {
                events.onDelete(id);
            }
        });
    });
}

// Menampilkan pesan kesalahan formulir
export function renderErrors(errors) {
    const fields = [
        "nama",
        "kategori",
        "satuan",
        "harga",
        "stok"
    ];

    fields.forEach(field => {
        const errorElement = document.getElementById(`error-${field}`);

        if (errorElement) {
            errorElement.textContent = errors[field] || "";
        }
    });
}

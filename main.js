
import {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct
} from "./modules/product_service.js";

import {
    renderProducts,
    renderErrors
} from "./modules/ui_renderer.js";

import {
    validateProduct
} from "./modules/validator.js";

// ======================================
// BAGIAN KATALOG PRODUK
// ======================================

const daftarProduk = document.querySelector("#daftar-produk");
const inputSearch = document.querySelector("#search");
const filterKategori = document.querySelector("#filter-kategori");

if (daftarProduk && inputSearch && filterKategori) {

    // Menampilkan produk berdasarkan pencarian dan kategori
    function tampilkanProduk() {
        const semuaProduk = getProducts();

        const kataKunci = inputSearch.value.toLowerCase();
        const kategoriDipilih = filterKategori.value;

        const hasilFilter = semuaProduk.filter(product => {
            const cocokNama = product.nama
                .toLowerCase()
                .includes(kataKunci);

            const cocokKategori = kategoriDipilih === "" ||
                product.kategori === kategoriDipilih;

            return cocokNama && cocokKategori;
        });

        renderProducts(hasilFilter, {
            onEdit: editProduk,
            onDelete: hapusProduk
        });
    }

    // Fungsi edit produk
    function editProduk(id) {
        const produk = getProducts().find(
            item => item.id === Number(id)
        );

        if (!produk) {
            alert("Produk tidak ditemukan.");
            return;
        }

        localStorage.setItem(
            "produk_diedit",
            JSON.stringify(produk)
        );

        window.location.href = "tambah-produk.html";
    }

    // Fungsi hapus produk
    function hapusProduk(id) {
        const konfirmasi = confirm(
            "Apakah kamu yakin ingin menghapus produk ini?"
        );

        if (konfirmasi) {
            deleteProduct(id);
            tampilkanProduk();
            alert("Produk berhasil dihapus.");
        }
    }

    // Event pencarian
    inputSearch.addEventListener("input", tampilkanProduk);

    // Event filter kategori
    filterKategori.addEventListener("change", tampilkanProduk);

    // Menampilkan produk pertama kali
    tampilkanProduk();

    // Menampilkan produk pertama kali
tampilkanProduk();

// Menampilkan data produk di Console
console.log("Daftar Produk KebunKita:", getProducts());
}


// ======================================
// BAGIAN FORM TAMBAH DAN EDIT PRODUK
// ======================================

const form = document.querySelector("#product-form");

if (form) {

    const inputNama = document.querySelector("#nama");
    const inputKategori = document.querySelector("#kategori");
    const inputSatuan = document.querySelector("#satuan");
    const inputHarga = document.querySelector("#harga");
    const inputStok = document.querySelector("#stok");
    const inputDeskripsi = document.querySelector("#deskripsi");

    const tombolSimpan = document.querySelector("#tombol-simpan");
    const tombolBatal = document.querySelector("#tombol-batal");
    const judulForm = document.querySelector("#judul-form");

    // Mengambil data yang akan diedit
    const dataEdit = localStorage.getItem("produk_diedit");

    let produkEdit = null;

    if (dataEdit) {
        try {
            produkEdit = JSON.parse(dataEdit);
        } catch (error) {
            console.error("Data edit tidak valid:", error);
            localStorage.removeItem("produk_diedit");
        }
    }

    // Mengisi formulir jika sedang mengedit produk
    if (produkEdit) {
        judulForm.textContent = "Edit Produk";
        tombolSimpan.textContent = "Update Produk";

        inputNama.value = produkEdit.nama;
        inputKategori.value = produkEdit.kategori;
        inputSatuan.value = produkEdit.satuan;
        inputHarga.value = produkEdit.harga;
        inputStok.value = produkEdit.stok;
        inputDeskripsi.value = produkEdit.deskripsi || "";
    }

    // Menghapus pesan error ketika pengguna mulai mengisi
    form.querySelectorAll("input, select").forEach(field => {
        field.addEventListener("input", () => {
            const errorElement = document.getElementById(
                `error-${field.id}`
            );

            if (errorElement) {
                errorElement.textContent = "";
            }
        });

        field.addEventListener("change", () => {
            const errorElement = document.getElementById(
                `error-${field.id}`
            );

            if (errorElement) {
                errorElement.textContent = "";
            }
        });
    });

    // Event saat formulir disimpan
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const dataProduk = {
            nama: inputNama.value.trim(),
            kategori: inputKategori.value,
            satuan: inputSatuan.value.trim(),
            harga: inputHarga.value,
            stok: inputStok.value,
            deskripsi: inputDeskripsi.value.trim()
        };

        // Memeriksa data menggunakan validator
        const errors = validateProduct(dataProduk);

        renderErrors(errors);

        // Jika masih ada kesalahan, proses dihentikan
        if (Object.keys(errors).length > 0) {
            return;
        }

        // Mengubah harga dan stok menjadi angka
        const produkSiapSimpan = {
            ...dataProduk,
            harga: Number(dataProduk.harga),
            stok: Number(dataProduk.stok)
        };

        if (produkEdit) {
            updateProduct(produkEdit.id, produkSiapSimpan);
            alert("Produk berhasil diperbarui.");
        } else {
            addProduct(produkSiapSimpan);
            alert("Produk berhasil ditambahkan.");
        }

        // Menghapus data sementara setelah penyimpanan
        localStorage.removeItem("produk_diedit");

        // Kembali ke katalog
        window.location.href = "katalog.html";
    });

    // Tombol batal
    tombolBatal.addEventListener("click", function() {
        localStorage.removeItem("produk_diedit");
        window.location.href = "katalog.html";
    });
}

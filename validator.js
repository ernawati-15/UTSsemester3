
export function validateProduct(data) {
    const errors = {};

    // Validasi nama produk
    if (!data.nama.trim()) {
        errors.nama = "Nama produk wajib diisi.";
    } else if (data.nama.trim().length < 3) {
        errors.nama = "Nama produk minimal 3 karakter.";
    }

    // Validasi kategori
    if (!data.kategori) {
        errors.kategori = "Kategori wajib dipilih.";
    }

    // Validasi satuan
    if (!data.satuan.trim()) {
        errors.satuan = "Satuan wajib diisi.";
    }

    // Validasi harga
    if (data.harga === "" || !Number.isFinite(Number(data.harga))) {
        errors.harga = "Harga wajib diisi dengan angka.";
    } else if (Number(data.harga) <= 0) {
        errors.harga = "Harga harus lebih dari 0.";
    }

    // Validasi stok
    if (data.stok === "" || !Number.isFinite(Number(data.stok))) {
        errors.stok = "Stok wajib diisi dengan angka.";
    } else if (!Number.isInteger(Number(data.stok))) {
        errors.stok = "Stok harus berupa bilangan bulat.";
    } else if (Number(data.stok) < 0) {
        errors.stok = "Stok tidak boleh kurang dari 0.";
    }

    return errors;
}


const STORAGE_KEY = "kebunkita_products";

// Data produk awal
const initialProducts = [
    {
        id: 1,
        nama: "Tomat Segar",
        kategori: "Sayuran",
        satuan: "Kg",
        harga: 12000,
        stok: 50,
        deskripsi: "Tomat segar hasil pertanian lokal."
    },
    {
        id: 2,
        nama: "Jagung Manis",
        kategori: "Biji-bijian",
        satuan: "Kg",
        harga: 10000,
        stok: 40,
        deskripsi: "Jagung manis berkualitas dan segar."
    },
    {
        id: 3,
        nama: "Bayam Hijau",
        kategori: "Sayuran",
        satuan: "Ikat",
        harga: 3000,
        stok: 30,
        deskripsi: "Bayam hijau segar yang baru dipanen."
    },
    {
        id: 4,
        nama: "Pisang Kepok",
        kategori: "Buah",
        satuan: "Sisir",
        harga: 15000,
        stok: 25,
        deskripsi: "Pisang kepok pilihan dari petani lokal."
    },
    {
        id: 5,
        nama: "Singkong",
        kategori: "Umbi-umbian",
        satuan: "Kg",
        harga: 7000,
        stok: 60,
        deskripsi: "Singkong segar cocok untuk berbagai olahan."
    }
];

// Mengambil data dari localStorage
function loadProducts() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (data === null) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
            return [...initialProducts];
        }

        const products = JSON.parse(data);

        if (!Array.isArray(products)) {
            throw new Error("Format data produk tidak valid.");
        }

        return products;
    } catch (error) {
        console.error("Gagal membaca data produk:", error);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
        return [...initialProducts];
    }
}

// Menyimpan data ke localStorage
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Mengambil seluruh produk
export function getProducts() {
    return loadProducts();
}

// Menambahkan produk baru
export function addProduct(product) {
    const products = loadProducts();

    const newProduct = {
        ...product,
        id: Date.now()
    };

    products.push(newProduct);
    saveProducts(products);

    return newProduct;
}

// Mengubah produk
export function updateProduct(id, updatedData) {
    const products = loadProducts();

    const updatedProducts = products.map(product => {
        if (product.id === Number(id)) {
            return {
                ...product,
                ...updatedData,
                id: product.id
            };
        }

        return product;
    });

    saveProducts(updatedProducts);
}

// Menghapus produk
export function deleteProduct(id) {
    const products = loadProducts();

    const filteredProducts = products.filter(
        product => product.id !== Number(id)
    );

    saveProducts(filteredProducts);
}

// Menghitung jumlah kategori
export function getCategoriesCount() {
    const products = loadProducts();

    const categories = products.map(product => product.kategori);

    return new Set(categories).size;
}

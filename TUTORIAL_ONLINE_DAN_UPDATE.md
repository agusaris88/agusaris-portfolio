# Tutorial Lengkap: Online dan Update Website Agus Aris

Dokumen ini menjelaskan dari awal sampai website online, database dinamis terhubung, dan cara mengelola lokasi, publikasi, media, serta materi pembelajaran.

## A. Isi paket website
- `index.html`: halaman depan.
- `admin.html`: halaman login dan pengelolaan konten.
- `assets/css/`: gaya tampilan.
- `assets/js/config.js`: konfigurasi Supabase dan email kontak.
- `assets/js/main.js`: peta satelit, tampilan lokasi, publikasi, media, dan pembelajaran.
- `assets/js/admin.js`: fungsi panel admin.
- `supabase_schema.sql`: struktur tabel dan aturan akses database.

## B. Publikasikan website ke GitHub Pages

1. Masuk ke https://github.com dan login.
2. Klik tombol `+` lalu `New repository`.
3. Isi nama repository, misalnya `agus-aris-portfolio`.
4. Pilih `Public` agar website GitHub Pages dapat diakses publik, lalu buat repository.
5. Buka repository baru, klik `Add file` → `Upload files`.
6. Ekstrak ZIP website di komputer Anda. Unggah **isi folder** ke root repository, bukan ZIP-nya. Pastikan `index.html`, `admin.html`, `assets/`, `supabase_schema.sql`, dan `README.md` berada pada root.
7. Klik `Commit changes`.
8. Buka tab `Settings` → `Pages`.
9. Pada `Build and deployment`, pilih `Deploy from a branch`.
10. Pilih branch `main` dan folder `/(root)`, lalu klik `Save`.
11. Tunggu proses deployment. URL website biasanya berbentuk `https://USERNAME.github.io/agus-aris-portfolio/`.
12. Buka URL itu. Pada tahap ini halaman depan dapat tampil, tetapi fitur database dinamis belum aktif sampai langkah C selesai.

## C. Siapkan database online dengan Supabase

1. Buka https://supabase.com lalu buat akun atau login.
2. Buat project baru. Simpan password database di tempat aman.
3. Setelah project selesai dibuat, buka menu `SQL Editor`.
4. Buka file `supabase_schema.sql` di komputer, salin seluruh isinya, tempelkan di SQL Editor, lalu klik `Run`.
5. Pastikan empat tabel berikut muncul pada `Table Editor`:
   - `research_locations`
   - `publications`
   - `media_items`
   - `learning_resources`
6. File SQL menambahkan beberapa lokasi contoh dengan koordinat regional perkiraan. **Ganti dengan koordinat hasil survei yang sudah diverifikasi sebelum digunakan untuk kebutuhan ilmiah.**
7. Buka `Project Settings` → `API` (atau halaman API Keys pada dashboard terbaru).
8. Salin `Project URL` dan **publishable key** atau legacy `anon` key. Keduanya digunakan pada kode browser. Jangan salin `service_role` atau secret key.
9. Di komputer, buka `assets/js/config.js`. Ubah menjadi seperti contoh berikut dengan URL dan key milik project Anda:
   ```js
   window.SITE_CONFIG = {
     supabaseUrl: "https://PROJECT_ID.supabase.co",
     supabaseAnonKey: "PUBLISHABLE_OR_ANON_KEY",
     contactEmail: "EMAIL_ANDA",
     refreshIntervalMs: 60000
   };
   ```
10. Simpan file. Jangan mengisi password database atau `service_role` key di sini.

## D. Buat akun administrator dengan aman

1. Di dashboard Supabase, buka `Authentication` → `Users`.
2. Pilih `Add user` / `Create new user`.
3. Masukkan email Anda dan buat password kuat.
4. Konfirmasi/verifikasi email jika diminta oleh pengaturan project.
5. Jika website hanya punya satu admin, nonaktifkan public sign-ups di pengaturan Authentication. Jangan menambahkan akun admin untuk orang yang tidak dipercaya.
6. Kebijakan SQL pada paket ini membatasi penulisan data untuk user yang sudah login, tetapi kebijakan default mengizinkan semua user terautentikasi menulis. Untuk penggunaan pribadi, pastikan hanya Anda yang dapat membuat akun. Untuk keamanan yang lebih ketat, kebijakan RLS sebaiknya dibatasi ke UUID akun admin Anda.

## E. Unggah pembaruan kode ke GitHub

1. Buka repository GitHub Anda.
2. Klik `Add file` → `Upload files`.
3. Unggah versi terbaru `index.html`, `admin.html`, folder `assets/`, `README.md`, `supabase_schema.sql`, dan file ini jika ingin menyimpan tutorial.
4. Jika diminta, pilih `Commit changes`.
5. Tunggu GitHub Pages selesai deploy, kemudian refresh website.
6. Buka halaman admin: `https://USERNAME.github.io/agus-aris-portfolio/admin.html`.
7. Jika repository bernama `agus-aris-portfolio`, tautan relatif `admin.html` dari halaman depan akan menuju halaman admin yang benar.

## F. Cara menambahkan lokasi penelitian

1. Buka website publik, lalu klik `Login Admin` pada menu atas atau tautan login di halaman depan.
2. Masuk dengan email dan password Supabase.
3. Pada panel admin, pilih tab `Lokasi riset`.
4. Isi:
   - `Nama lokasi`: nama lokasi yang mudah dikenali.
   - `Wilayah administratif`: desa/kecamatan/kabupaten/provinsi sesuai kebutuhan.
   - `Latitude`: koordinat lintang desimal.
   - `Longitude`: koordinat bujur desimal.
   - `Topik penelitian`: tema atau parameter penelitian.
   - `Deskripsi`: ringkasan konteks dan tujuan.
   - `Tahun/periode`: tahun atau rentang pengamatan.
   - `Link luaran (JSON)`: opsional, daftar tautan publikasi yang berkaitan.
5. Contoh koordinat desimal: latitude `-5.12345`, longitude `119.12345`. Jangan menukar urutan latitude dan longitude.
6. Contoh format link luaran:
   ```json
   [
     {
       "title": "Judul artikel",
       "url": "https://doi.org/10.xxxx/xxxxx"
     },
     {
       "title": "Laporan penelitian",
       "url": "https://example.org/laporan"
     }
   ]
   ```
7. Klik `Simpan konten`.
8. Kembali ke halaman depan. Titik baru akan muncul di peta satelit; klik titik untuk melihat nama, wilayah, deskripsi, dan tautan luaran.
9. Untuk mengubah titik, cari item di panel `Konten tersimpan`, klik `Edit`, perbarui kolom, lalu simpan.
10. Untuk menghapus, klik `Hapus`. Pastikan data benar-benar tidak dibutuhkan sebelum mengonfirmasi.

## G. Cara menambahkan publikasi jurnal

1. Login ke `admin.html`.
2. Pilih tab `Publikasi`.
3. Masukkan judul publikasi, penulis, tahun, nama jurnal/prosiding, jenis luaran, dan URL DOI atau laman penerbit.
4. Klik `Simpan konten`.
5. Publikasi tampil pada bagian `Publikasi` di halaman depan. Cantumkan hanya metadata dan tautan yang benar-benar terverifikasi.

## H. Cara menambahkan media

1. Pilih tab `Media`.
2. Isi judul, deskripsi, kategori, dan tanggal/periode jika ada.
3. `URL gambar` harus merupakan URL gambar yang dapat diakses publik langsung, misalnya tautan gambar dari penyimpanan publik atau CDN. Tautan halaman Google Drive biasa mungkin tidak cocok sebagai URL gambar langsung.
4. Isi `URL media/video` dengan tautan dokumentasi, video, poster, atau halaman terkait.
5. Simpan dan cek hasilnya di bagian `Media`.
6. Jangan unggah data lapangan sensitif atau gambar yang belum mendapat izin publikasi.

## I. Cara menambahkan materi pembelajaran

1. Pilih tab `Pembelajaran`.
2. Masukkan judul, deskripsi, kategori, format (PDF/PPTX/video/tutorial), dan URL materi.
3. Pastikan file dapat diakses oleh audiens yang dituju.
4. Simpan dan cek bagian `Pembelajaran` di halaman depan.

## J. Cara update kode desain website

- Perubahan isi (lokasi, publikasi, media, pembelajaran): lakukan dari `admin.html`; tidak perlu mengedit HTML.
- Perubahan desain atau fungsi: edit file di komputer, unggah file yang diubah ke GitHub, lalu commit.
- Perubahan konfigurasi Supabase/email: edit `assets/js/config.js`, lalu commit ke GitHub.
- Website membaca perubahan dari database melalui Supabase Realtime dan penyegaran berkala sekitar 60 detik. Kecepatan update dipengaruhi koneksi, konfigurasi Realtime, dan cache browser.

## K. Troubleshooting

- **Login gagal:** periksa email/password dan pastikan user dibuat di Supabase Authentication.
- **Peta tampil tetapi titik kosong:** pastikan konfigurasi Supabase benar, tabel sudah dibuat, dan kebijakan SELECT publik aktif.
- **Tidak bisa menyimpan:** periksa apakah sudah login, tabel ada, serta kebijakan RLS/permission.
- **Perubahan tidak muncul:** refresh halaman; periksa Realtime pada dashboard Supabase; pastikan tabel terdaftar pada publication `supabase_realtime`.
- **Halaman admin 404:** pastikan `admin.html` ada di root repository dan deployment GitHub Pages sudah selesai.
- **Peta satelit tidak tampil:** periksa koneksi internet, tile service, browser console, dan atribusi penyedia.
- **URL website salah:** gunakan URL yang ditampilkan pada `Settings` → `Pages`, terutama jika repository bukan repository khusus `USERNAME.github.io`.

## L. Catatan keamanan dan atribusi

- GitHub Pages bersifat publik; jangan menyimpan data rahasia pada repository.
- Jangan pernah menaruh `service_role` key, password database, token rahasia, atau kredensial admin dalam HTML/JavaScript.
- Publishable/anon key dapat berada di frontend hanya jika tabel dilindungi RLS dan kebijakan aksesnya benar.
- Kode SQL awal membolehkan semua user terautentikasi mengubah data. Untuk penerapan satu admin, matikan pendaftaran publik dan batasi policy penulisan ke akun admin yang benar-benar berwenang.
- Basemap satelit memakai Esri World Imagery. Atribusi sumber tetap tampil di peta; periksa syarat layanan dan penggunaan imagery sesuai kebutuhan publikasi.

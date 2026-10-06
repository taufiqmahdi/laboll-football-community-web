// Article bodies as HTML, kept apart from news.ts so the client-side news list doesn't bundle them.
// Static, hand-written content only: it's rendered with dangerouslySetInnerHTML.
const content: Record<string, string> = {
  "laboll-cup-season-3-dibuka": `
<p>Yang ditunggu-tunggu akhirnya datang juga. <strong>Laboll Cup Season 3</strong> resmi buka pendaftaran, dan kali ini skalanya lebih gede dari dua season sebelumnya. Total hadiahnya Rp 15 juta, dibagi buat juara 1 sampai 3.</p>
<h2>Format turnamen</h2>
<p>Ada 16 slot tim yang dibagi ke 4 grup. Dua tim teratas tiap grup lanjut ke fase gugur, mulai dari perempat final sampai final. Semua laga dimainkan di Lapangan ABC Senayan, 24 Oktober sampai 8 November 2026.</p>
<ul>
  <li><strong>Juara 1:</strong> Rp 8.000.000 + trofi</li>
  <li><strong>Juara 2:</strong> Rp 4.000.000</li>
  <li><strong>Juara 3:</strong> Rp 3.000.000</li>
</ul>
<h2>Cara daftar</h2>
<p>Biaya pendaftaran Rp 1.500.000 per tim. Siapin minimal 11 pemain plus cadangan, terus isi formulir di halaman turnamen. Slot dikunci begitu pembayaran masuk, jadi siapa cepat dia dapat.</p>
<blockquote>Pendaftaran ditutup 15 Oktober, atau lebih cepat kalau 16 slot udah penuh duluan.</blockquote>
<p>Detail lengkap dan formulirnya ada di <a href="/tournament/laboll-cup-3">halaman Laboll Cup Season 3</a>. Ajak timmu sekarang, ya!</p>
`,
  "kenalan-sama-garuda-muda": `
<p>Tiap Selasa jam 4 sore, ada satu grup yang hampir nggak pernah absen dari lapangan: <strong>Garuda Muda</strong>. Awalnya cuma lima orang teman satu kantor yang pengen keringetan sepulang kerja. Sekarang member aktifnya udah lebih dari empat puluh orang.</p>
<h2>Dari grup chat kantor</h2>
<p>"Dulu kita main cuma karena bosen meeting," cerita Dimas, salah satu pendirinya. "Terus ada yang ngajak teman, teman ngajak teman lagi. Tau-tau kita butuh dua lapangan."</p>
<p>Yang bikin Garuda Muda beda adalah suasananya. Nggak ada yang dimarahin karena salah oper, dan pemain baru selalu dikenalin ke semua orang sebelum kick-off.</p>
<h2>Aturan main ala Garuda Muda</h2>
<ul>
  <li>Tim diacak tiap minggu, biar semua orang kenal satu sama lain.</li>
  <li>Kiper gantian tiap 15 menit, jadi nggak ada yang "dihukum" jaga gawang terus.</li>
  <li>Habis main, wajib nongkrong minimal satu gelas es teh.</li>
</ul>
<blockquote>"Menang kalah itu bonus. Yang penting minggu depan semuanya pengen balik lagi."</blockquote>
<p>Penasaran pengen ikut? Cari jadwal Garuda Muda di halaman jadwal dan booking slot kamu.</p>
`,
  "tips-anti-cedera-mini-soccer": `
<p>Mini soccer itu cepat, lapangannya kecil, dan kontak fisiknya lumayan sering. Kombinasi ini bikin cedera ringan gampang banget kejadian. Kabar baiknya, sebagian besar bisa dicegah dengan kebiasaan sederhana.</p>
<h2>1. Pemanasan beneran, bukan formalitas</h2>
<p>Lima menit jogging ringan, terus lanjut peregangan dinamis kayak leg swing dan lunges. Hindari peregangan statis yang lama sebelum main, simpan itu buat pendinginan.</p>
<h2>2. Pakai sepatu yang cocok sama rumputnya</h2>
<p>Rumput sintetis paling pas pakai sepatu turf (TF) atau artificial grass (AG). Pul panjang buat rumput asli malah bikin kaki "nyangkut" dan rawan keseleo.</p>
<h2>3. Minum sebelum haus</h2>
<p>Main malam pun tetap bikin dehidrasi. Minum sedikit-sedikit tiap jeda, jangan nunggu tenggorokan kering.</p>
<h2>4. Kenali batas badan</h2>
<p>Kalau ada nyeri tajam, berhenti. Bukan pegal biasa, tapi nyeri yang bikin kamu pincang. Satu minggu istirahat jauh lebih baik daripada satu bulan absen.</p>
<h2>5. Jangan lupa pendinginan</h2>
<p>Jalan santai dan peregangan statis 5 sampai 10 menit setelah main bantu otot pulih lebih cepat. Besoknya kamu bakal berterima kasih sama diri sendiri.</p>
`,
  "recap-night-league-oktober": `
<p>Pekan ketiga Night League jadi pekan paling produktif sejauh ini. <strong>23 gol</strong> tercipta dari 6 pertandingan, dan dua laga ditentukan di menit-menit terakhir.</p>
<h2>Laga terbaik pekan ini</h2>
<p>Kemang United vs Ballers Senayan berakhir 5&#8209;4 setelah sempat tertinggal 1&#8209;3 di babak pertama. Gol penentu datang lewat tendangan voli dari luar kotak penalti yang bikin satu lapangan berdiri.</p>
<h2>Klasemen sementara</h2>
<ol>
  <li><strong>Kemang United</strong> - 9 poin</li>
  <li><strong>Sunday League JKT</strong> - 7 poin</li>
  <li><strong>Ballers Senayan</strong> - 6 poin</li>
</ol>
<p>Persaingan masih ketat banget. Dengan empat pekan tersisa, selisih tiga poin bisa berubah dalam satu malam.</p>
<blockquote>Night League edisi November udah buka pendaftaran. Slotnya tinggal sedikit, lho!</blockquote>
`,
  "third-jersey-pre-order": `
<p>Setelah home dan away, sekarang giliran <strong>Third Jersey 2026/27</strong>. Warnanya oranye kalem yang tetap kelihatan sporty, dengan detail garis tipis di kerah dan lengan.</p>
<h2>Kenapa bakal jadi favorit</h2>
<ul>
  <li>Bahan dry-fit yang adem, cocok buat main malam di Jakarta.</li>
  <li>Potongan regular fit, nggak terlalu ketat tapi juga nggak kedodoran.</li>
  <li>Bisa custom nama dan nomor punggung tanpa biaya tambahan.</li>
</ul>
<h2>Info pre-order</h2>
<p>Harga normalnya Rp 285.000, dan member Laboll dapat potongan 10%. Pre-order ditutup <strong>18 Oktober</strong>, dan jersey dikirim awal November.</p>
<p>Cek ukuran dan pesan langsung di <a href="/merchandise/third-jersey-2026">halaman Third Jersey 2026/27</a>.</p>
`,
  "posisi-kiper-fun-game": `
<p>Di banyak fun game, slot kiper itu gratis. Tapi tetap aja sering kosong, karena banyak yang takut kebobolan terus atau merasa nggak bisa. Padahal jadi kiper di fun game bisa seru banget kalau tahu caranya.</p>
<h2>Posisi badan dulu</h2>
<p>Lutut sedikit ditekuk, berat badan di ujung kaki, tangan siap di depan dada. Posisi ini bikin kamu bisa gerak ke kiri atau kanan dengan cepat.</p>
<h2>Ngomong terus</h2>
<p>Kiper itu satu-satunya pemain yang lihat seluruh lapangan. Kasih tahu bek kalau ada lawan lolos, dan teriak "keeper!" kalau kamu mau ambil bola. Bek kamu bakal berterima kasih.</p>
<h2>Sarung tangan yang worth it</h2>
<p>Buat pemula, nggak perlu yang mahal. Cari yang telapaknya latex dan ada pengaman jari, biasanya udah cukup buat rumput sintetis.</p>
<blockquote>Kebobolan itu biasa. Yang diingat orang biasanya justru satu penyelamatan keren kamu.</blockquote>
`,
  "fun-league-agustus-juara": `
<p>Fun League Agustus resmi selesai, dan <strong>Kopi Senja FC</strong> keluar sebagai juara tanpa sekali pun kalah dalam tujuh pekan.</p>
<h2>Perjalanan sang juara</h2>
<p>Lima kemenangan dan dua hasil imbang, dengan cuma kebobolan enam gol sepanjang musim. Kuncinya ada di lini belakang yang disiplin dan kiper yang tampil konsisten tiap minggu.</p>
<h2>Penghargaan individu</h2>
<ul>
  <li><strong>Top skor:</strong> Raka (Kopi Senja FC) - 11 gol</li>
  <li><strong>Kiper terbaik:</strong> Bima (Kopi Senja FC) - 3 clean sheet</li>
  <li><strong>Pemain favorit:</strong> Aldo (Sunday League JKT)</li>
</ul>
<p>Terima kasih buat delapan tim yang udah meramaikan. Sampai ketemu di musim berikutnya!</p>
`,
  "main-bareng-member-baru": `
<p>Pertama kali ikut main bareng orang yang belum kamu kenal itu wajar kalau deg-degan. Tenang, hampir semua pemain di Laboll juga mulai dari situ.</p>
<h2>Booking slot</h2>
<p>Pilih jadwal di halaman jadwal, cek level permainannya, terus booking sebagai Player atau GK. Begitu pembayaran terkonfirmasi, nama kamu masuk ke line up.</p>
<h2>Yang perlu dibawa</h2>
<ul>
  <li>Sepatu yang cocok sama jenis lapangan.</li>
  <li>Botol minum, biar nggak bolak-balik beli.</li>
  <li>Baju ganti dan handuk kecil.</li>
</ul>
<h2>Etika di lapangan</h2>
<p>Datang 15 menit sebelum mulai, kenalan sama host, dan main secukupnya. Hindari tekel keras, karena semua orang masih harus kerja besok paginya.</p>
<blockquote>Datang sendirian? Bilang aja ke host, nanti kamu dikenalin ke yang lain.</blockquote>
`,
  "kualifikasi-laboll-cup-season-2": `
<p>Babak kualifikasi Laboll Cup Season 2 bener-bener nguras emosi. Dari delapan laga, <strong>tiga harus diselesaikan lewat adu penalti</strong>.</p>
<h2>Drama di titik putih</h2>
<p>Laga paling menegangkan terjadi antara Garuda Muda dan Laboll FC. Skor imbang 2&#8209;2 sampai peluit panjang, dan adu penalti baru selesai di penendang kedelapan.</p>
<h2>Kuda hitam musim ini</h2>
<p>Tim debutan Kemang United bikin kejutan dengan menyingkirkan unggulan kedua. Mainnya rapi, serangan baliknya cepat, dan jelas bukan tim yang bisa diremehkan.</p>
<p>Delapan tim yang lolos bakal lanjut ke fase grup mulai pekan depan. Pantau terus jadwalnya, ya!</p>
`,
};

export function getArticleContent(slug: string) {
  return content[slug] ?? "";
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Ambil data komentar dari body
    const { name, comment } = req.body;

    // Log data ke Vercel Logs
    console.log(`Komentar dari ${name}: ${comment}`);

    // Kirim respons sukses
    return res.status(200).json({ message: 'Komentar berhasil disimpan!' });
  } else {
    // Jika bukan metode POST, kembalikan status 405 (Method Not Allowed)
    return res.status(405).json({ message: 'Metode tidak diizinkan' });
  }
}

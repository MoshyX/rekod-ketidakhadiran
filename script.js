// Tunggu sehingga semua kandungan HTML dimuatkan
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('absence-form');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', function(e) {
        // Halang borang dari berfungsi secara normal
        e.preventDefault();

        // Dapatkan URL tindakan (action URL) dari atribut 'action' borang
        const formActionURL = form.getAttribute('action');
        
        // Cipta objek FormData dari data borang
        const formData = new FormData(form);

        // Dapatkan nama murid dan sebab untuk mesej WhatsApp
        // PENTING: Gantikan 'entry.123456789' dengan name attribute sebenar untuk NAMA
        // PENTING: Gantikan 'entry.112233445' dengan name attribute sebenar untuk SEBAB
        const namaMurid = formData.get('entry.1682386424'); 
        const sebab = formData.get('entry.857488014');

        // Tukar status butang kepada 'Menghantar...'
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menghantar...';

        // Hantar data ke Google Form menggunakan Fetch API
        fetch(formActionURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Penting untuk elak ralat CORS
        }).then(() => {
            // Bina mesej untuk WhatsApp
            const whatsappMessage = `Assalamualaikum, ingin memaklumkan bahawa anak saya, *${namaMurid}*, tidak dapat hadir ke sekolah pada hari ini kerana *${sebab}*. Terima kasih.`;
            const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

            // Paparkan pop-up kejayaan menggunakan SweetAlert2
            Swal.fire({
                title: 'Berjaya!',
                text: 'Rekod ketidakhadiran anda telah disimpan.',
                icon: 'success',
                confirmButtonText: 'OK',
                showCancelButton: true,
                cancelButtonText: 'Kongsi ke WhatsApp',
                cancelButtonColor: '#25D366'
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    // Jika butang 'Kongsi ke WhatsApp' ditekan
                    window.open(whatsappURL, '_blank');
                }
            });

            // Reset borang dan butang
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Hantar Makluman';

        }).catch(error => {
            // Jika berlaku ralat
            console.error('Error!', error.message);
            Swal.fire({
                title: 'Ralat!',
                text: 'Gagal menghantar data. Sila cuba lagi.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            // Kembalikan butang ke keadaan asal
            submitBtn.disabled = false;
            submitBtn.textContent = 'Hantar Makluman';
        });
    });
});

// Letak kod ini di dalam event listener DOMContentLoaded dalam script.js

async function displayRecords() {
    // Gantikan dengan URL .csv anda yang telah diterbitkan
    const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9rOx6UjrSq33l_CvTV38rQH5VHlrStU4nokV4buEL_YstUBSvbqP43MZ0t8404X6g0iMAHaguJPu0/pub?output=csv'; 

    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Potong baris header

        const todayAbsencesDiv = document.getElementById('today-absences');
        const monthlyRecordDiv = document.getElementById('monthly-record');

        todayAbsencesDiv.innerHTML = ''; // Kosongkan kandungan sedia ada

        const today = new Date().toLocaleDateString('en-CA'); // Format YYYY-MM-DD

        rows.forEach(row => {
            const columns = row.split(',');
            // Andaian: Timestamp [0], Nama [1], Tarikh [2], Sebab [3]
            const recordDate = new Date(columns[2]).toLocaleDateString('en-CA');
            const studentName = columns[1];

            if (recordDate === today) {
                todayAbsencesDiv.innerHTML += `<p><strong>${studentName}</strong></p>`;
            }
        });

        if (todayAbsencesDiv.innerHTML === '') {
            todayAbsencesDiv.innerHTML = '<p><em>Tiada rekod ketidakhadiran untuk hari ini.</em></p>';
        }

        // Logik untuk rekod bulanan boleh ditambah di sini.

    } catch (error) {
        console.error('Gagal memuatkan rekod:', error);
    }
}

// Panggil fungsi ini apabila halaman dimuatkan
displayRecords();
// Nota: Fungsi untuk memaparkan rekod akan dibincangkan di bahagian lain.

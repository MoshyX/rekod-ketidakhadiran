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

// Nota: Fungsi untuk memaparkan rekod akan dibincangkan di bahagian lain.
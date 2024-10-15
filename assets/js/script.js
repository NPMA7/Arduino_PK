// const endpoint = 'http://192.168.x.x'; // isikan IP controller
main();
let lokasi = [];
function main(){
    fetch('/assets/json/kodeWilayah.json')
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        lokasi = data;
    })
    .catch(error => {
        console.error(error);
    });
    const status = document.getElementById('status');
    const powerButton = document.getElementById('powerButton');
    if(powerButton.innerText == 'Nyalakan Mesin'){
        status.innerHTML = 'Status = On';
        powerButton.innerText = 'Matikan Mesin'
    }else{
        status.innerHTML = 'Status = Off';
        powerButton.innerText = 'Nyalakan Mesin';
    }    
}
/*
    catatan:
    1) jika hasil seearch tidak muncul saat mengetik atau menekan enter
       maka coba nonaktifkan salah satunya lalu restart kembali server
    2) gunakan kodeWilayah2.json jika ingin melakukan pengujian karena didalamnya sudah tersedia 
       dari provinsi sampai tingkat desa
*/ 
function search(){
    let input = document.getElementById('searchLokasi');
    let outLokasi = document.getElementById('lokasi');
    outLokasi.innerHTML = ``; 

    // metode search ketika button diclick
    Object.entries(lokasi).forEach(([key, value])=> {
        let cari = input.value.toLowerCase();
        if(input.value == ''){
            outLokasi.innerHTML = ``; 
        }else if (key.toLowerCase().includes(cari)){
            kode = value
            outLokasi.innerHTML += `
            <button onclick="fetchLokasi('${kode}')">${key}</button>
            `;
        }
    });
    // metode search ketika tombol enter ditekan
    input.addEventListener('keydown', (event) =>{
        outLokasi.innerHTML = ``; 
        console.log(event.key);
        if(event.key == 'Enter'){
            Object.entries(lokasi).forEach(([key, value])=> {
                let cari = input.value.toLowerCase();
                if(input.value == ''){
                    outLokasi.innerHTML = ``; 
                }else if (key.toLowerCase().includes(cari)){
                    kode = value
                    outLokasi.innerHTML += `
                    <button onclick="fetchLokasi('${kode}')">${key}</button>
                    `;
                }
            });
        }
    });

    // metode searching agar ketika keyboard diketik langsung muncul outputnya
    
    // input.addEventListener('input', e => {
    //      outLokasi.innerHTML = ``; 
    //      let cari = e.target.value.toLowerCase();
    //      console.log(cari);
    //      Object.entries(lokasi).forEach(([key, value])=> {
    //          if(cari == ''){
    //             outLokasi.innerHTML += ``
    //          }else if(key.toLowerCase().includes(cari)){
    //             kode = value
    //             outLokasi.innerHTML += `
    //             <button onclick="fetchLokasi('${kode}')">${key}</button>
    //             `;
    //          }
    //      });
    //  });
    
}
async function fetchLokasi(kode) {
    let panjang = kode.length;
    let kodeLokasi = '';
    if(panjang == 2){
        kodeLokasi = `adm1=${kode}`;
    }else if(panjang == 5){
        kodeLokasi = `adm2=${kode}`;
    }else if(panjang == 8){
        kodeLokasi = `adm3=${kode}`;
    }else if(panjang == 13){
        kodeLokasi = `adm4=${kode}`;
    }else{
        console.log("ERROR");
    }
    console.log(kode);
    console.log(panjang);
    try{
        const response = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?${kodeLokasi}`);
        if(!response.ok){
            throw new Error ('could not fetch resource');
        }
        const data = await response.json();
        const arah = {
            N : 'Utara',
            E : 'Timur',
            W : 'Barat',
            S : 'Selatan',
            NE : 'Timur Laut',
            SE : 'Tenggara',
            SW : 'Barat Daya',
            NW :'Barat Laut'
        }
        console.log(data);
        let lokasi = data.lokasi;
        if(kodeLokasi.includes("adm1")){
            lokasi = lokasi.provinsi;
        }else if(kodeLokasi.includes("adm2")){
            lokasi = lokasi.kota;
        }else if(kodeLokasi.includes("adm3")){
            lokasi = lokasi.kecamatan;
        }else if(kodeLokasi.includes("adm4")){
            lokasi = lokasi.desa;
        }
        const cuaca = data.data[0].cuaca[0][0].weather_desc;
        const waktu = data.data[0].cuaca[0][0].local_datetime;
        const suhu = data.data[0].cuaca[0][0].t;
        const kelembapan = data.data[0].cuaca[0][0].hu;
        const kecAngin = data.data[0].cuaca[0][0].ws;
        const arhAngin = arah[data.data[0].cuaca[0][0].wd];
        
        let statistik = document.getElementById('statCuaca');
        statistik.innerHTML = `
                                <h4>Lokasi : ${lokasi}</h4>
                                <h4>Cuaca : ${cuaca}</h4>
                                <h4>Suhu saat ini : ${suhu}°C</h4>
                                <h4>Kecepatan angin : ${kecAngin} m/s</h4>
                                <h4>Arah angin : ${arhAngin}</h4>
                                <h4>Kelembaban : ${kelembapan}%</h4>
                                <h4>Waktu : ${waktu}</h4>
                                
        `;
                                // h4>Waktu analisis : ${anDate}</h4>
    }
    catch(error){
        console.error(error);
    }
}

// function getMesin(){
//     fetch(endpoint)
//         .then(response => response.text())
//         .then(result =>{
//             if(result == 'ON'){
//                 console.log('mesin menyala');
//             }else{
//                 console.log('mesin mati');
//             }
//     });
// }

// function setMesin(){
//     fetch(endpoint, {
//         method: "POST" 
//     })
//         .then(response => response.text())
//         .then(() => location.reload());
// }

// getMesin();
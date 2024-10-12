// const endpoint = 'http://192.168.x.x'; // isikan IP controller

function main(){
    var status = document.getElementById('status');
    var powerButton = document.getElementById('powerButton');
    if(powerButton.innerText == 'Nyalakan Mesin'){
        status.innerHTML = 'Status = On';
        powerButton.innerText = 'Matikan Mesin'
    }else{
        status.innerHTML = 'Status = Off';
        powerButton.innerText = 'Nyalakan Mesin';
    }
}

async function fetchData() {
    try{
        const response = await fetch('https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=32.04.15.2005');
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
        const lokasi = data.lokasi.desa;
        const cuaca = data.data[0].cuaca[0][0].weather_desc;
        const waktu = data.data[0].cuaca[0][0].local_datetime;
        const suhu = data.data[0].cuaca[0][0].t;
        const kelembapan = data.data[0].cuaca[0][0].hu;
        const kecAngin = data.data[0].cuaca[0][0].ws;
        const arhAngin = arah[data.data[0].cuaca[0][0].wd];
        // const anDate =  data.data[0].cuaca[0][0].analysis_date;
        
        let statistik = document.getElementById('statCuaca');
        statistik.innerHTML += `
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
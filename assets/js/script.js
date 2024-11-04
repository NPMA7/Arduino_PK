const endpoint = "http://192.168.x.x"; // Replace with the actual IP
main();
let lokasi = [];

function main() {
  fetch("/assets/json/kodeWilayah.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      lokasi = data;
      togglePowerButton();
    })
    .catch((error) => console.error(error));
}
document.getElementById("powerButton").addEventListener("click", ()=>{
  togglePowerButton();
});

function togglePowerButton() {
  const status = document.getElementById("statusMesin");
  const informasi = document.getElementById("infoMesin");
  if (informasi.innerText === "Pakaian sedang disimpan") {
    status.innerText = "Status = On";
    informasi.innerText = "Pakaian sedang dijemur";
  } else {
    status.innerHTML = "Status = Off";
    informasi.innerText = "Pakaian sedang disimpan";
  }
}

document.getElementById("popUpCari").addEventListener("click", ()=>{
  document.getElementById("popupOverlay").style.display= "flex";
});
document.getElementById("close-btn").addEventListener("click", ()=>{
  document.getElementById("popupOverlay").style.display= "none";
});
document.getElementById("lokasi").addEventListener("click", ()=>{
  document.getElementById("popupOverlay").style.display= "none";
});
function search() {
    let input = document.getElementById('searchLokasi');
    let outLokasi = document.getElementById('lokasi');
    outLokasi.innerHTML = '';
    let cari = input.value.toLowerCase();

    if (cari === '') {
        outLokasi.innerHTML = '';
        return;
    }

    Object.entries(lokasi).forEach(([key, value]) => {
        if (key.toLowerCase().includes(cari)) {
            outLokasi.innerHTML += `
                <div class="cursor-pointer p-2 border-2 border-transparent hover:border-blue-500 transition duration-300 rounded-lg bg-gray-200 m-1 whitespace-nowrap" onclick="fetchLokasi('${value}')">${key}</div>
            `;
        }
    });
}


document.getElementById("searchLokasi").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    search();
    document.getElementById("searchButton").click(); // Simulate button click
  }
});

async function fetchLokasi(kode) {
  let panjang = kode.length;
  let kodeLokasi = "";
  if (panjang === 2) {
    kodeLokasi = `adm1=${kode}`;
  } else if (panjang === 5) {
    kodeLokasi = `adm2=${kode}`;
  } else if (panjang === 8) {
    kodeLokasi = `adm3=${kode}`;
  } else if (panjang === 13) {
    kodeLokasi = `adm4=${kode}`;
  } else {
    console.log("ERROR");
    return;
  }

  try {
    const response = await fetch(
      `https://api.bmkg.go.id/publik/prakiraan-cuaca?${kodeLokasi}`
    );
    if (!response.ok) throw new Error("Could not fetch resource");
    const data = await response.json();
    console.log(data);
    let lokasi = data.lokasi;
    if (kodeLokasi.includes("adm1")) lokasi = lokasi.provinsi;
    else if (kodeLokasi.includes("adm2")) lokasi = lokasi.kota;
    else if (kodeLokasi.includes("adm3")) lokasi = lokasi.kecamatan;
    else if (kodeLokasi.includes("adm4")) lokasi = lokasi.desa;

    const cuaca = data.data[0].cuaca[0][0].weather_desc;
    const waktu = data.data[0].cuaca[0][0].local_datetime.split(" ");
    const suhu = data.data[0].cuaca[0][0].t;
    const suhuPagi = data.data[0].cuaca[0][0].t;
    const suhuSiang = data.data[0].cuaca[0][0].t;
    const suhuSore = data.data[0].cuaca[0][0].t;
    const suhuMAlam = data.data[0].cuaca[0][0].t;
    const suhuBesok = data.data[0].cuaca[1][2].t;
    const suhuLusa = data.data[0].cuaca[2][2].t;
    const suhuBesokLusa = data.data[0].cuaca[2][1].t;
    const kelembapan = data.data[0].cuaca[0][0].hu;
    const kecAngin = data.data[0].cuaca[0][0].ws;
    const tanggal = waktu[0];
    const waktuSekarang = new Date();
    const jam = waktuSekarang.getHours();
    const menit = waktuSekarang.getMinutes();
    const detik = waktuSekarang.getSeconds();
    const hari = new Date(tanggal);
    const hariHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"];
    const indexHari = hari.getDay();
    const namaHari  = hariHari[indexHari];

    // Prediksi cuaca 3 hari kedepan
    const hariBesok = hariHari[indexHari +1];
    const hariLusa = hariHari[indexHari +2];
    const hariBesokLusa = hariHari[indexHari +3];
    // const arhAngin = {
    //   N: "Utara",
    //   E: "Timur",
    //   W: "Barat",
    //   S: "Selatan",
    //   NE: "Timur Laut",
    //   SE: "Tenggara",
    //   SW: "Barat Daya",
    //   NW: "Barat Laut",
    // }[data.data[0].cuaca[0][0].wd];

        document.getElementById('hari').innerText = namaHari;
        document.getElementById('lokasiCuaca').innerText = lokasi;
        document.getElementById('cuaca').innerText = cuaca;
        document.getElementById('suhu').innerText = `${suhu}°C`;
        document.getElementById('kecAngin').innerText = `${kecAngin} m/s`;
        // document.getElementById('arhAngin').innerText = arhAngin;
        document.getElementById('kelembapan').innerText = `${kelembapan}%`;
        document.getElementById('tanggal').innerText = `${tanggal}, `;

        
        document.getElementById("besok").innerText = hariBesok;
        document.getElementById("suhuBesok").innerText = `${suhuBesok}°C`;
        document.getElementById("lusa").innerText = hariLusa;
        document.getElementById("suhuLusa").innerText = `${suhuLusa}°C`;
        document.getElementById("besokLusa").innerText = hariBesokLusa;
        document.getElementById("suhuBesokLusa").innerText = `${suhuBesokLusa}°C`;
    // hapus pencarian sebelumnya
    // document.getElementById("lokasi").innerHTML = "";
  } catch (error) {
    console.error(error);
  }
}
function jam(){
  const waktuSekarang = new Date();
  const jam = waktuSekarang.getHours();
  const menit = waktuSekarang.getMinutes();
  const detik = waktuSekarang.getSeconds();
  document.getElementById('jam').innerText = ` ${jam}:${menit}:${detik}`;
}
console.log(document.getElementById("tanggal").innerText != "");
if(document.getElementById("tanggal").innerText == ""){
  setInterval(jam, 1000);
}
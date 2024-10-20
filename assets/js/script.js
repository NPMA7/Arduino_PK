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

function togglePowerButton() {
  const status = document.getElementById("status");
  const powerButton = document.getElementById("powerButton");
  if (powerButton.innerText === "Nyalakan Mesin") {
    status.innerHTML = "Status = On";
    powerButton.innerText = "Matikan Mesin";
  } else {
    status.innerHTML = "Status = Off";
    powerButton.innerText = "Nyalakan Mesin";
  }
}
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

    let lokasi = data.lokasi;
    if (kodeLokasi.includes("adm1")) lokasi = lokasi.provinsi;
    else if (kodeLokasi.includes("adm2")) lokasi = lokasi.kota;
    else if (kodeLokasi.includes("adm3")) lokasi = lokasi.kecamatan;
    else if (kodeLokasi.includes("adm4")) lokasi = lokasi.desa;

    const cuaca = data.data[0].cuaca[0][0].weather_desc;
    const waktu = data.data[0].cuaca[0][0].local_datetime;
    const suhu = data.data[0].cuaca[0][0].t;
    const kelembapan = data.data[0].cuaca[0][0].hu;
    const kecAngin = data.data[0].cuaca[0][0].ws;
    const arhAngin = {
      N: "Utara",
      E: "Timur",
      W: "Barat",
      S: "Selatan",
      NE: "Timur Laut",
      SE: "Tenggara",
      SW: "Barat Daya",
      NW: "Barat Laut",
    }[data.data[0].cuaca[0][0].wd];

        document.getElementById('lokasiCuaca').innerText = lokasi;
        document.getElementById('cuaca').innerText = cuaca;
        document.getElementById('suhu').innerText = `${suhu}°C`;
        document.getElementById('kecAngin').innerText = `${kecAngin} m/s`;
        document.getElementById('arhAngin').innerText = arhAngin;
        document.getElementById('kelembapan').innerText = `${kelembapan}%`;
        document.getElementById('waktu').innerText = waktu;
    
    // hapus pencarian sebelumnya
    // document.getElementById("lokasi").innerHTML = "";
  } catch (error) {
    console.error(error);
  }
}

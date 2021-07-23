const map = L.map('map', {
    zoomControl: false 
  }).setView([25.033976 , 121.5623502], 7)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  const Icon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
  });


let data;

  fetch('	https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindFestivalTypeJ',{})
  .then((response) => {
    return response.json(); 
  }).then((jsonData) => {
    data=jsonData;
    renderData();
    addCountyList();
  }).catch((err) => {
    console.log('錯誤:', err);
  });


const markers = new L.MarkerClusterGroup().addTo(map);

let info = [];
const renderData = () => {
data.forEach((item)=>{
info.push(item);
  if(item?.latitude==null&&item?.longitude==null){
            return;
          }
          let lat = item.latitude;
          let lng = item.longitude;
          let actName = item.actName;
          let actTime = moment(item.actTime).format('YYYY-MM-DD');
          let actAdd = item.address;
            markers.addLayer(
            L.marker([lng,lat], {icon: Icon}).bindPopup(
              `<ul class='minBox'>
              <li class='minBox_title'>${actName}</li>
              <li class='minBox_item'><i class="fa fa-calendar" aria-hidden="true"></i>　${actTime}</li>
              <li class='minBox_item'><i class="fa fa-map-marker" aria-hidden="true"></i>　${actAdd}</li>
              </ul>`
            ));
  })  }
  

const countyOpt = document.querySelector('.citys');
const townOpt = document.querySelector('.zones');
townOpt.innerHTML = `<option value="">請選擇鄉鎮區</option>`;

const addCountyList=()=>{
  let allCounty = [];
  let countyStr = '';
  countyStr +=`<option>請選擇縣市</option>`
info.forEach((item)=>{
  let cityName  = item.cityName;
  let countyName = cityName.slice(0,3);
  if(allCounty.indexOf(countyName) == -1 && countyName !==''){
    allCounty.push(countyName);
    countyStr +=`<option valualue='${countyName}'>${countyName}</option>`
  }
  })
  countyOpt.innerHTML = countyStr;
}


countyOpt.addEventListener('change',(e)=>{
let targetCity = e.target.value;
let allTown = [];
let newTownList = '';
let townStr = `<option value="">請選擇鄉鎮區</option>`;
info.forEach((item)=>{
let cityName = item.cityName;
let countyName = cityName.slice(0,3); 
let townName = cityName.slice(5,8); 
if(targetCity==countyName){
allTown.push(townName);
}
})
newTownList = new Set(allTown);
newTownList = Array.from(newTownList);
newTownList.forEach((item)=>{
  townStr += `<option value="${item}">${item}</option>`
})
townOpt.innerHTML = townStr;
})
 
townOpt.addEventListener('change',(e)=>{
let town=e.target.value;
let townLngLat = [];
info.forEach((item)=>{
let cityName = item.cityName;
let countyName = cityName.slice(0,3); 
let townName = cityName.slice(5,8); 
let lat = item.latitude;
let lng = item.longitude;
if(town==townName&&countyName==countyOpt.value){
  townLngLat = [lng,lat];
  county = countyName;
}})
map.setView(townLngLat,20);
renderList(county,town,);
})

const renderList=(county,town)=>{
  let str ='';
info.forEach((item,index)=>{
  let lat = item.latitude;
  let lng = item.longitude;
  let cityName = item.cityName;
  let countyName = cityName.slice(0,3); 
  let townName = cityName.slice(5,8); 
  let actName = item.actName;
  let actTime = moment(item.startTime).format('YYYY-MM-DD'); 
  let actEnd = moment(item.endTime).format('YYYY-MM-DD'); 
  let actAdd = item.address;
  let website = item.website;
if(countyName==county&&townName==town){
str +=`<div class="content" data-lat=${lat} data-lng=${lng}> 
           <div class="content_img">
           <i class="fa fa-star fa-2x data-id=${index}" aria-hidden="true"></i>
           <img src="https://picsum.photos/id/6${index}/600/400" alt="">
       </div>
       <p class="content_title">
       <a href="${website}">${actName}</a></p>
       <ul class="content_item">
           <li>開始時間:　${actTime}</li>
           <li>結束時間:　${actEnd}</li>
           <li>活動地點:　${actAdd}</li>
       </ul>
        </div>`
}
}

)
document.querySelector('.content_wrap').innerHTML = str;
let oninfo = document.querySelectorAll('.content');
gotoDeo(oninfo);


  console.log(item)
  let star = document.getElementsByClassName('fa-star')
  console.log(typeof star)
  let starArr= Array.from(star)
  console.log(starArr)
  starArr.forEach(item=>{
    item.addEventListener('click',function(e){
      alert('hi~已加入收藏！')
      console.log(e.target)
    })
  })
}


const gotoDeo=(oninfo)=>{
  oninfo.forEach((item)=>{
    item.addEventListener('click',(e)=>{
      
       Lat = Number(e.currentTarget.dataset.lat);
       Lng = Number(e.currentTarget.dataset.lng);
            map.setView([Lng, Lat], 20);
            markers.eachLayer(function (layer) {
                const layerLatLng = layer.getLatLng();
                if (layerLatLng.lat == Lat && layerLatLng.lng == Lng) {
                  layer.openPopup();}})
                })})}
   
   





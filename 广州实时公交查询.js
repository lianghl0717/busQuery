var lat;
var lng;
var bus = [];
var station = [];
var busNum;

getLocation();
$ui.render({
  views: [
    {
      type: "button",
      props: {
        title: "公交查询"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super);
        make.width.equalTo(120);
        make.height.equalTo(60);
      },
      events: {
        tapped: function(sender) {
          getLocation();
          bus = [];
          station = [];
        }
      }
    }
  ]
});

function getLocation() {
  $location.fetch({
    handler: function(result) {
      lat = result.lat;
      lng = result.lng;
      console.info(lat + "," + lng);
      getByGps();
    }
  });
}

function getByGps() {
  $http.post({
    url: "https://rycxapi.gci-china.com/xxt-api-v5.0/search/getByGPS.do",
    header: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: {
      "Source": 0,
      "data": { "Source": 0, "longitude": lng, "latitude": lat },
      "appid": "rycxGci001",
      "sign": "3A9B44F7BA05C4188AE58F72CA9108E098A6A671",
      "reqpara": {
        "Source": 0,
        "speed": 0,
        "uid": "0",
        "direct": 0,
        "devtype": 1,
        "gpstime": 1541220821000,
        "devno": "66850128-DFC6-4612-BEF1-CE88FD2BE2A0",
        "version": "1.1.7",
        "lat": lat,
        "lng": lng
      },
      "reqtime": 1541220821000
    },
    handler: function(resp) {
      var data = resp.data;
      console.info(data);
      console.info(data.retData.bus);

      for (i in data.retData.bus) {
        station.push({
          "name": data.retData.bus[i].n,
          "i": data.retData.bus[i].i
        });
      }
      choseStation();
    }
  });
}

function getByStation(i) {
  $http.post({
    url:
      "https://rycxapi.gci-china.com/xxt-api-v5.0/bus/routeStation/getByStation.do",
    header: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: {
      "Source": 0,
      "data": { "Source": 0, "stationNameId": i.toString() },
      "appid": "rycxGci001",
      "sign": "0171797E7A21FAB35608306880F6E06827CEF91C",
      "reqpara": {
        "Source": 0,
        "speed": 0,
        "uid": "0",
        "direct": 0,
        "devtype": 1,
        "gpstime": 1541220827000,
        "devno": "66850128-DFC6-4612-BEF1-CE88FD2BE2A0",
        "version": "1.1.7",
        "lat": lat,
        "lng": lng
      },
      "reqtime": 1541220827000
    },
    handler: function(resp) {
      var data = resp.data.retData.l;
      console.info(data);

      for (i in data) {
        bus.push({
          "name": data[i].rn + " " + data[i].dn,
          "ri": data[i].ri,
          "rsi": data[i].rsi,
          "num": data[i].rn
        });
      }
      choseBus();
    }
  });
}

function getByRouteIdAndDirection(ri) {
  $http.post({
    url:
      "https://rycxapi.gci-china.com/xxt-api-v5.0/bus/route/getByRouteIdAndDirection.do",
    header: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: {
      "Source": 0,
      "data": {
        "routeId": ri,
        "direction": "0",
        "Source": 0
      },
      "appid": "rycxGci001",
      "sign": "6E678AFDE624EDD7AB39CA63A5B559E75A17F1B2",
      "reqpara": {
        "Source": 0,
        "speed": 0,
        "uid": "0",
        "direct": 0,
        "devtype": 1,
        "gpstime": 1541220841000,
        "devno": "66850128-DFC6-4612-BEF1-CE88FD2BE2A0",
        "version": "1.1.7",
        "lat": lat,
        "lng": lng
      },
      "reqtime": 1541220841000
    },
    handler: function(resp) {
      var data = resp.data;
      console.info(data);
    }
  });
}

function getWaitTime(rsi) {
  $http.post({
    url: "https://rycxapi.gci-china.com/xxt-api-v5.0/bus/forecast/waitTime.do",
    header: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: {
      "Source": 0,
      "data": {
        "num": 3,
        "Source": 0,
        "routeStationId": rsi
      },
      "appid": "rycxGci001",
      "sign": "7E487758F744B3B85761F4785BD891BEE71CF5AD",
      "reqpara": {
        "Source": 0,
        "speed": 0,
        "uid": "0",
        "direct": 0,
        "devtype": 1,
        "gpstime": 1541220841000,
        "devno": "66850128-DFC6-4612-BEF1-CE88FD2BE2A0",
        "version": "1.1.7",
        "lat": lat,
        "lng": lng
      },
      "reqtime": 1541220841000
    },
    handler: function(resp) {
      var data = resp.data.retData.list[0];
      console.info(data);
      if (data.count != -1)
        alert(
          "下一班" +
            busNum +
            "还有" +
            data.count +
            "站,大约需要" +
            data.time +
            "分钟"
        );
      else alert("尚未发车");
    }
  });
}

function choseStation() {
  $ui.toast("请选择一个公交站")
  $ui.menu({
    items: station.map(function(item) {
      return item.name;
    }),
    handler: function(title, idx) {
      var i = station[idx].i;
      getByStation(i);
    }
  });
}

function choseBus() {
  $ui.toast("请选择您查询的公交车");
  $ui.menu({
    items: bus.map(function(item) {
      return item.name;
    }),
    handler: function(title, idx) {
      busNum = bus[idx].num;
      var ri = bus[idx].ri;
      var rsi = bus[idx].rsi;
      getByRouteIdAndDirection(ri);

      getWaitTime(rsi);
    }
  });
}

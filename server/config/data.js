'use strict';
var data = [
    {
      "time": 0.023,
      "geoip": {
        "location": [
          22.69999999999999,
          63.66669999999999
        ],
        "real_region_name": "Western Finland",
        "timezone": "Europe/Helsinki",
        "longitude": 22.69999999999999,
        "ip": "93.106.90.142",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "region_name": "15",
        "city_name": "Jakobstad",
        "latitude": 63.66669999999999
      }
    },
    {
      "time": 0.028,
      "geoip": {
        "location": [
          24.433300000000003,
          60.11670000000001
        ],
        "real_region_name": "Southern Finland",
        "timezone": "Europe/Helsinki",
        "longitude": 24.433300000000003,
        "ip": "88.115.173.168",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "region_name": "13",
        "city_name": "Kirkkonummi",
        "latitude": 60.11670000000001
      }
    },
    {
      "time": 0.004,
      "geoip": {
        "location": [
          25.933300000000003,
          60.94999999999999
        ],
        "real_region_name": "Southern Finland",
        "timezone": "Europe/Helsinki",
        "longitude": 25.933300000000003,
        "ip": "81.175.195.184",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "region_name": "13",
        "city_name": "Nastola",
        "latitude": 60.94999999999999
      }
    },
    {
      "time": 0.023,
      "geoip": {
        "location": [
          25.75,
          60.80000000000001
        ],
        "real_region_name": "Southern Finland",
        "timezone": "Europe/Helsinki",
        "longitude": 25.75,
        "ip": "81.175.202.105",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "region_name": "13",
        "city_name": "Orimattila",
        "latitude": 60.80000000000001
      }
    },
    {
      "time": 0.029,
      "geoip": {
        "location": [
          25.75,
          60.80000000000001
        ],
        "real_region_name": "Southern Finland",
        "timezone": "Europe/Helsinki",
        "longitude": 25.75,
        "ip": "81.175.202.105",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "region_name": "13",
        "city_name": "Orimattila",
        "latitude": 60.80000000000001
      }
    },
    {
      "time": 0,
      "geoip": {
        "location": [
          25.716700000000003,
          66.5
        ],
        "real_region_name": "Lapland",
        "timezone": "Europe/Helsinki",
        "longitude": 25.716700000000003,
        "ip": "80.222.87.44",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "region_name": "06",
        "city_name": "Rovaniemi",
        "latitude": 66.5
      }
    },
    {
      "time": 0.021,
      "geoip": {
        "location": [
          26,
          64
        ],
        "ip": "157.144.241.147",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "latitude": 64,
        "longitude": 26,
        "timezone": "Europe/Helsinki"
      }
    },
    {
      "time": 0,
      "geoip": {
        "location": [
          23.13329999999999,
          60.38329999999999
        ],
        "real_region_name": "Western Finland",
        "timezone": "Europe/Helsinki",
        "longitude": 23.13329999999999,
        "ip": "91.154.34.24",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "region_name": "15",
        "city_name": "Salo",
        "latitude": 60.38329999999999
      }
    },
    {
      "time": 0,
      "geoip": {
        "location": [
          26,
          64
        ],
        "ip": "87.92.197.211",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "latitude": 64,
        "longitude": 26,
        "timezone": "Europe/Helsinki"
      }
    },
    {
      "time": 0.003,
      "geoip": {
        "location": [
          29.25,
          63.233300000000014
        ],
        "real_region_name": "Eastern Finland",
        "timezone": "Europe/Helsinki",
        "longitude": 29.25,
        "ip": "88.192.115.133",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "region_name": "14",
        "city_name": "Juuka",
        "latitude": 63.233300000000014
      }
    },
    {
      "time": 0.023,
      "geoip": {
        "location": [
          23.75,
          61.5
        ],
        "real_region_name": "Western Finland",
        "timezone": "Europe/Helsinki",
        "longitude": 23.75,
        "ip": "91.156.198.50",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "region_name": "15",
        "city_name": "Tampere",
        "latitude": 61.5
      }
    },
    {
      "time": 0.051,
      "geoip": {
        "location": [
          26,
          64
        ],
        "ip": "85.76.72.98",
        "country_code2": "FI",
        "country_code3": "FIN",
        "country_name": "Finland",
        "continent_code": "EU",
        "latitude": 64,
        "longitude": 26,
        "timezone": "Europe/Helsinki"
    }
  }
]
// Export the config object based on the NODE_ENV
// ==============================================
module.exports =  {
  data: data
}
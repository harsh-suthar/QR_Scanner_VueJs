const listApp = new Vue({
    el: '#listingApp',
    data: {
        records: []
    },
    mounted: function() {
        axios.get('https://jsonstorage.net/api/items/e9d6fccf-c43b-4f01-a131-3870729bfe3d')
        .then(data => this.records = data.data.Record);
    }
});

var app = new Vue({
    el: '#app',
    data: {
        scanner: null,
        activeCameraId: null,
        cameras: [],
        records: {
            Record: []
        },
        TxnID: ''
    },
    mounted: function () {
        this.initializeCamera();
        this.TxnID = this.getQueryVariable("TxnID");
    },
    methods: {
        addRecord: function (content) {
            const isExists = this.records.Record.filter( row => row.ScannedCode === content).length;
            if(isExists)
            {
                alert('The Scan code is already exists please add quantity!');
                return;
            }
            this.records.Record.unshift({ ScannedCode: content, QTY: 1, Price: 1, TxnID: this.TxnID });
        },
        selectCamera: function (camera) {
            this.activeCameraId = camera.id;
            this.scanner.start(camera);
        },
        initializeCamera: function(){
            var self = this;
            self.scanner = new Instascan.Scanner({ video: document.getElementById('qr-video'), scanPeriod: 5 });
            self.scanner.addListener('scan', function (content, image) {
                self.addRecord(content);
            });
            Instascan.Camera.getCameras().then(function (cameras) {
                self.cameras = cameras;
                if (cameras.length > 0) {
                    self.activeCameraId = cameras[0].id;
                    self.scanner.start(cameras[0]);
                } else {
                    console.error('No cameras found.');
                }
            }).catch(function (e) {
                console.error(e);
            });
        },
        getQueryVariable: function(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
            console.log('Query variable %s not found', variable);
        },
        postData: function () {
            const jsonString = JSON.stringify(this.records);
            alert(jsonString);
            console.log(jsonString)
        }
    }
});
var myapp = angular.module('starter', ['ionic', 'ngCordova', 'ion-autocomplete']);

myapp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

myapp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('firstPage', {
      url: '/firstPage',
      templateUrl: 'templates/firstPage.html',
      controller: 'myController'
    })
    .state('dutCardInfo', {
      url: '/dutCardInfo',
      templateUrl: 'templates/dutCardInfo.html',
      controller: 'myController'
    })
    .state('Records', {
      url: '/Records',
      templateUrl: 'templates/Records.html',
      controller: 'myController'
    })
    .state('transactionDetail', {
      url: '/transactionDetail',
      templateUrl: 'templates/transactionDetail.html',
      controller: 'myController'
    })
    .state('transactionFailed', {
      url: '/transactionFailed',
      templateUrl: 'templates/transactionFailed.html',
      controller: 'myController'
    });
  $urlRouterProvider.otherwise('/firstPage');

});

myapp.controller('myController', function ($scope, $rootScope, $cordovaFile, $ionicPopup) {
  $scope.sendEmail = function () {
    if(window.plugins && window.plugins.emailComposer){ // make sure plugin is available
      window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
          console.log('email success');
        },
        'subject here', //subject,
        'content here', //body,
        'bed380@mail.usask.ca', // toRecipients,
        null, // ccRecipients,
        null, // bccRecipients,
        true, // isHtml,
        ['files://newPersistentFile.txt'], // attachments,
        // file:///data/user/0/com.ionicframework.admob118910/files/files/
        null // attachmentsData
      );
    }
  };
  $scope.link = 'http://ionicframework.com/img/ionic-logo-blog.png';

  $scope.download = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getDirectory(
          "ExampleProject",
          {
            create: true
          },
          function(dirEntry) {
            dirEntry.getFile(
              "test.png",
              {
                create: true,
                exclusive: false
              },
              function gotFileEntry(fe) {
                var p = fe.toURL();
                fe.remove();
                ft = new FileTransfer();
                ft.download(
                  encodeURI("http://ionicframework.com/img/ionic-logo-blog.png"),
                  p,
                  function(entry) {
                    $ionicLoading.hide();
                    $scope.imgFile1 = entry.toURL();
                    $scope.link = 'img got';
                  },
                  function(error) {
                    $ionicLoading.hide();
                    alert("Download Error Source -> " + error.source);
                  },
                  false,
                  null
                );
              },
              function() {
                $ionicLoading.hide();
                alert("Get file failed");
              }
            );
          }
        );
      },
      function() {
        $ionicLoading.hide();
        console.log("Request for filesystem failed");
      });
  };

  $scope.load = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getDirectory(
          "ExampleProject",
          {
            create: false
          },
          function(dirEntry) {
            dirEntry.getFile(
              "test.png",
              {
                create: false,
                exclusive: false
              },
              function gotFileEntry(fe) {
                $ionicLoading.hide();
                $scope.imgFile = fe.toURL();
                $scope.link = 'img loaded';
              },
              function(error) {
                $ionicLoading.hide();
                alert("Error getting file");
              }
            );
          }
        );
      },
      function() {
        $ionicLoading.hide();
        console.log("Error requesting filesystem");
      });
  };

  $scope.msg = '0';
  $scope.newDir = function () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      $scope.msg = '1';
      alert('file system open: ' + fs.name);
      $scope.msg = '2';
      $scope.dir_path = fs.root.toURL();
      fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {
        $scope.msg = '3';
        alert("fileEntry is file?" + fileEntry.isFile.toString());
        // fileEntry.name == 'someFile.txt'
        // fileEntry.fullPath == '/someFile.txt'
        $scope.file_path = fileEntry.toURL();
        writeFile(fileEntry, null);
        copyFile(fileEntry,"newPersistentFile.txt","/storage/emulated/0/Download/");

        $scope.msg = '4';

      }, function () {
        $scope.msg = '5';
      });

    }, function () {
      $scope.msg = '6';
    });
  };

  function writeFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {
      fileWriter.onwriteend = function() {
        alert("Successful file write...");
        readFile(fileEntry);
      };
      fileWriter.onerror = function (e) {
        alert("Failed file write: " + e.toString());
      };
      // If data object is not passed in,
      // create a new Blob instead.
      if (!dataObj) {
        dataObj = new Blob(['some file dataaaa'], { type: 'text/plain' });
      }
      fileWriter.write(dataObj);
    });
  }

  function readFile(fileEntry) {
    fileEntry.file(function (file) {
      var reader = new FileReader();
      reader.onloadend = function() {
        alert("Successful file read: " + this.result + fileEntry.fullPath);
        displayFileData(fileEntry.fullPath + ": " + this.result);
        $scope.mess = this.result;
      };
      reader.readAsText(file);
    }, function () {
      alert('read error');
    });
  }

  $scope.newFile = function () {
    $cordovaFile.createDir(cordova.file.externalDataDirectory, "new_dir", false)
      .then(function (success) {
        alert('new dir good'+cordova.file.externalDataDirectory);
      }, function (error) {
        alert('new dir error');
      });

    var url = "http://ionicframework.com/img/ionic-logo-blog.png";
    var targetPath = cordova.file.externalDataDirectory + "testImage.png";
    var trustHosts = true;
    var options = {};

    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        alert('downloaded');// Success!
      }, function(err) {
        alert('download error');// Error
      }, function (progress) {
        $timeout(function () {
          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        });
      });

    $cordovaFile.createFile(cordova.file.externalDataDirectory, "new_dir/new_file.txt", true)
      .then(function (success) {
        alert('new file good');// success
      }, function (error) {
        alert('new file error');// error
      });
  };

  $scope.date = new Date();


  ///////////// Define global variables////////////////
  $scope.deviceType = '';
  $scope.sn = '';
  $scope.sw = '';

  $scope.issuingBnak = '';
  $scope.pno = '';
  $scope.fpan = '';
  $scope.dpan = '';

  $scope.refCardType = '';
  $scope.refBank = '';
  $scope.refFpan = '';

  var dutInfo = ['NA', 'NA', 'NA'];
  var paymentCardInfo = ['NA', 'NA', 'NA', 'NA', 'NA'];
  var refInfo = ['NA', 'NA', 'NA'];

  ///////////// Save DUT and cards info////////////////
  $scope.saveDutInfo = function () {
    dutInfo[0] = $scope.deviceType;
    dutInfo[1] = $scope.sn;
    dutInfo[2] = $scope.sw;
    alert('wa '+ dutInfo);
    for(i=0;i<dutInfo.length;i++){
      if (dutInfo[i].length == 0 && i == 0){
        alert('please enter device type');
        throw new Error('This is not an error. This is just to abort javascript');
      }
      else if (dutInfo[i].length == 0 && i == 1){
        alert('please enter serial number');
        throw new Error('This is not an error. This is just to abort javascript');
      }
      else if (dutInfo[i].length == 0 && i == 2){
        alert('please enter SW version');
        throw new Error('This is not an error. This is just to abort javascript');
      }
    }
    $scope.deviceType = '';
    $scope.sn = '';
    $scope.sw = '';
    $scope.saveToFile(0);
  };

  ///////////// Button bar control////////////////
  $scope.setActive = function(num) {
    $scope.var = num;
  };

  //////////// functions////////////////
  $scope.saveDutCardInfo = function () {
    paymentCardInfo[0] = $scope.var;
    paymentCardInfo[1] = $scope.issuingBnak;
    paymentCardInfo[2] = $scope.pno;
    paymentCardInfo[3] = $scope.fpan;
    paymentCardInfo[4] = $scope.dpan;
    alert('wa '+ paymentCardInfo);
    for(i=0;i<paymentCardInfo.length;i++){
      if (paymentCardInfo[i].length == 0 && i == 0){
        alert('please select card type');
        throw new Error('This is not an error. This is just to abort javascript');
      }
      else if (paymentCardInfo[i].length == 0 && i == 1){
        alert('please enter issuing bank');
        throw new Error('This is not an error. This is just to abort javascript');
      }
      else if (paymentCardInfo[i].length == 0 && i == 2){
        alert('please enter PNO');
        throw new Error('This is not an error. This is just to abort javascript');
      }
      else if (paymentCardInfo[i].length == 0 && i == 3){
        alert('please enter FPAN');
        throw new Error('This is not an error. This is just to abort javascript');
      }
      else if (paymentCardInfo[i].length == 0 && i == 4){
        alert('please enter DPAN');
        throw new Error('This is not an error. This is just to abort javascript');
      }
    }
    $scope.issuingBnak = '';
    $scope.pno = '';
    $scope.fpan = '';
    $scope.dpan = '';
    $scope.saveToFile(1);
  };

  $scope.saveRefInfo = function () {
    refInfo[0] = $scope.refCardType;
    refInfo[1] = $scope.refBank;
    refInfo[2] = $scope.refFpan;
    alert('wa '+ refInfo);
    for(i=0;i<refInfo.length;i++){
      if (refInfo[i].length == 0 && i == 0){
        alert('please enter card type');
        throw new Error('This is not an error. This is just to abort javascript');
      }
      else if (refInfo[i].length == 0 && i == 1){
        alert('please enter issuing bank');
        throw new Error('This is not an error. This is just to abort javascript');
      }
      else if (refInfo[i].length == 0 && i == 2){
        alert('please enter FPAN');
        throw new Error('This is not an error. This is just to abort javascript');
      }
    }
    $scope.refCardType = '';
    $scope.refBank = '';
    $scope.refFpan = '';
    $scope.saveToFile(2);
  };

  $scope.saveToFile = function (option) {
    var fileName = '';
    var data = [];
    switch (option){
      case 0:
        fileName = 'dutInfo.txt';
        data = dutInfo;
        break;
      case 1:
        fileName = 'paymentCardInfo.txt';
        data = paymentCardInfo;
        break;
      case 2:
        fileName = 'refInfo.txt';
        data = refInfo;
    }

    $cordovaFile.createFile(cordova.file.externalDataDirectory, fileName, false)
      .then(function (success) {
        alert('new file created');// success
      }, function (error) {
        alert('new file error');// error
      });

    $cordovaFile.writeExistingFile(cordova.file.externalDataDirectory, fileName, data+';')
      .then(function (success) {
        console.log('file write good'); // success
      }, function (error) {
        alert('file write error'); // error
      });
  };

  //////////// user confirmation////////////////
  $scope.showConfirm = function(option) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'User Confirmation',
      template: 'Are you sure you want clear the records?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        clearRecords(option);
      } else {
        console.log('You are not sure');
      }
    });
  };

  function clearRecords (option) {
    var fileName = '';
    var data = [];
    switch (option){
      case 0:
        fileName = 'dutInfo.txt';
        data = dutInfo;
        break;
      case 1:
        fileName = 'paymentCardInfo.txt';
        data = paymentCardInfo;
        break;
      case 2:
        fileName = 'refInfo.txt';
        data = refInfo;
    }

    $cordovaFile.writeFile(cordova.file.externalDataDirectory, fileName, '', true)
      .then(function (success) {
        alert('records cleared'); // success
      }, function (error) {
        alert('file write error'); // error
      });
  }

//////////////Show records////////////////////
  $scope.read = function (option) {
    var fileName = '';
    switch (option) {
      case 0:
        fileName = 'dutInfo.txt';
        $cordovaFile.readAsText(cordova.file.externalDataDirectory, fileName)
          .then(function (success) {
            console.log('read success');// success
            $scope.a = success;
            $scope.b = $scope.a.split(';');
          }, function (error) {
            alert('read error ');// error
          });
        break;
      case 1:
        fileName = 'paymentCardInfo.txt';
        $cordovaFile.readAsText(cordova.file.externalDataDirectory, fileName)
          .then(function (success) {
            console.log('read success');// success
            $scope.c = success;
            $scope.d = $scope.c.split(';');
          }, function (error) {
            alert('read error ');// error
          });
        break;
      case 2:
        fileName = 'refInfo.txt';
        $cordovaFile.readAsText(cordova.file.externalDataDirectory, fileName)
          .then(function (success) {
            console.log('read success');// success
            $scope.e = success;
            $scope.f = $scope.e.split(';');
          }, function (error) {
            alert('read error ');// error
          });

    }
  };

//////////////Auto complete////////////////////
  $scope.cityName = '';
  $scope.model = "";
  $scope.cityChecked = "";
  $scope.storeName = 'sss';

  $scope.getTestItems = function (query, option) {
    if(option ==1) {
      var data = {items: storeList};
    }
    else if(option ==2) {
      data = {items: cityList};
    }
    var viewArray = [];

    for(var i=0; i <data.items.length; i++) {
      if (data.items[i].view.toLowerCase().indexOf(query.toLowerCase()) >= 0 && query !== '') {
        viewArray.push({name:data.items[i].name, view: data.items[i].view});
      }
    }

    for(var i=0; i <data.items.length; i++) {
      if (data.items[i].view.toLowerCase().indexOf(query.toLowerCase()) < 0 && query !== '') {
        viewArray.push({name: query, view: query});
        break;
      }
    } //if no match, return whatever query is

    // if (query) {
    //   return {
    //     items: storeList
    //   };
    // }

    return {items: viewArray}; //get all partial match

  };

//////////////Save to csvEntry////////////////////
  $scope.saveToCsvEntry = function () {

  };

  var storeList = [{name:"2 For 1 Pizza", view:"2 For 1 Pizza"},{name:"7-Eleven", view:"7-Eleven"},{name:"A And P", view:"A And P"},{name:"A And W", view:"A And W"},{name:"A Buck Or Two", view:"A Buck Or Two"},{name:"A G A Variety", view:"A G A Variety"},{name:"Abc Country Restaurant", view:"Abc Country Restaurant"},{name:"Aeropostale", view:"Aeropostale"},{name:"Alcool Nb Liquor", view:"Alcool Nb Liquor"},{name:"Aldo", view:"Aldo"},{name:"Alimentation", view:"Alimentation"},{name:"Amco", view:"Amco"},{name:"American Apparel", view:"American Apparel"},{name:"Amir Restaurant", view:"Amir Restaurant"},{name:"Arby'S", view:"Arby'S"},{name:"Aritzia", view:"Aritzia"},{name:"Atlantic Superstore", view:"Atlantic Superstore"},{name:"Atlantic Superstore Fuel", view:"Atlantic Superstore Fuel"},{name:"Au Vieux Duluth Express", view:"Au Vieux Duluth Express"},{name:"Avondale Foods", view:"Avondale Foods"},{name:"Baskin Robbins", view:"Baskin Robbins"},{name:"Baton Rouge", view:"Baton Rouge"},{name:"Bc Liquor", view:"Bc Liquor"},{name:"Bean Around The World", view:"Bean Around The World"},{name:"Bell World", view:"Bell World"},{name:"Benson Autoparts", view:"Benson Autoparts"},{name:"Bentley", view:"Bentley"},{name:"Best Buy", view:"Best Buy"},{name:"Best Western Hotel", view:"Best Western Hotel"},{name:"Big Bee Convenience", view:"Big Bee Convenience"},{name:"Bistro Van Houtte", view:"Bistro Van Houtte"},{name:"Black'S Photo", view:"Black'S Photo"},{name:"Blenz Coffee", view:"Blenz Coffee"},{name:"Blue Mountain", view:"Blue Mountain"},{name:"Booster Juice", view:"Booster Juice"},{name:"Boston Pizza", view:"Boston Pizza"},{name:"Boys' Co. Clothing", view:"Boys' Co. Clothing"},{name:"Brunet Pharmacy", view:"Brunet Pharmacy"},{name:"Bubble Tease", view:"Bubble Tease"},{name:"Buffalo", view:"Buffalo"},{name:"Bulk Barn", view:"Bulk Barn"},{name:"Burberry", view:"Burberry"},{name:"Burger King", view:"Burger King"},{name:"Burrito Boyz", view:"Burrito Boyz"},{name:"Buy Low Foods", view:"Buy Low Foods"},{name:"Byob", view:"Byob"},{name:"Cafe Depot", view:"Cafe Depot"},{name:"Cafe Supreme", view:"Cafe Supreme"},{name:"Caferama", view:"Caferama"},{name:"Calendar Club", view:"Calendar Club"},{name:"Canada Post", view:"Canada Post"},{name:"Canada Safeway", view:"Canada Safeway"},{name:"Canada'S Wonderland", view:"Canada'S Wonderland"},{name:"Canadian Tire", view:"Canadian Tire"},{name:"Canadian Tire Petroleum", view:"Canadian Tire Petroleum"},{name:"Casa Grecque", view:"Casa Grecque"},{name:"Casey'S", view:"Casey'S"},{name:"Cash & Carry", view:"Cash & Carry"},{name:"Centre De Service Auto", view:"Centre De Service Auto"},{name:"Chapters", view:"Chapters"},{name:"Chartwells", view:"Chartwells"},{name:"Chez Ashton", view:"Chez Ashton"},{name:"Chez Tante Marie", view:"Chez Tante Marie"},{name:"Chicknchick", view:"Chicknchick"},{name:"Church'S Chicken", view:"Church'S Chicken"},{name:"Cineplex", view:"Cineplex"},{name:"Cinnabon", view:"Cinnabon"},{name:"Clini Plus", view:"Clini Plus"},{name:"Clipper Cafe", view:"Clipper Cafe"},{name:"Club", view:"Club"},{name:"Cobs Bread", view:"Cobs Bread"},{name:"Coconuts Restaurant", view:"Coconuts Restaurant"},{name:"Coffee Time", view:"Coffee Time"},{name:"Coles", view:"Coles"},{name:"Collinson Convenience", view:"Collinson Convenience"},{name:"Comfort Inn", view:"Comfort Inn"},{name:"Continental Currency", view:"Continental Currency"},{name:"Costco", view:"Costco"},{name:"Couche Tard", view:"Couche Tard"},{name:"Country Style", view:"Country Style"},{name:"Coyote Jack'S", view:"Coyote Jack'S"},{name:"Crabby Joe'S", view:"Crabby Joe'S"},{name:"Crevier", view:"Crevier"},{name:"Croissant Plus", view:"Croissant Plus"},{name:"Cultures", view:"Cultures"},{name:"Dagwoods Sandwichs Et Salades", view:"Dagwoods Sandwichs Et Salades"},{name:"Dairy Queen", view:"Dairy Queen"},{name:"Dairy Queen/Orange Julius", view:"Dairy Queen/Orange Julius"},{name:"Daisy Mart", view:"Daisy Mart"},{name:"Denny'S", view:"Denny'S"},{name:"Depanneur 7 Jours", view:"Depanneur 7 Jours"},{name:"Depanneur Boni Soir", view:"Depanneur Boni Soir"},{name:"Discount Car Rental", view:"Discount Car Rental"},{name:"Dollar Tree", view:"Dollar Tree"},{name:"Dominion", view:"Dominion"},{name:"Domino'S Pizza", view:"Domino'S Pizza"},{name:"Domo Gasoline", view:"Domo Gasoline"},{name:"Dunkin Donuts", view:"Dunkin Donuts"},{name:"Earl'S", view:"Earl'S"},{name:"East Side Mario'S", view:"East Side Mario'S"},{name:"Easy Financial Services", view:"Easy Financial Services"},{name:"Easy Home Lease-To-Own", view:"Easy Home Lease-To-Own"},{name:"Eb Games", view:"Eb Games"},{name:"Eclipse", view:"Eclipse"},{name:"Edo Japan", view:"Edo Japan"},{name:"Eggsmart", view:"Eggsmart"},{name:"Eglinton Cafe", view:"Eglinton Cafe"},{name:"Electronic Arts", view:"Electronic Arts"},{name:"Enterprise Rent A Car", view:"Enterprise Rent A Car"},{name:"Esso", view:"Esso"},{name:"Extra Foods", view:"Extra Foods"},{name:"Extreme Pita", view:"Extreme Pita"},{name:"Fabricland", view:"Fabricland"},{name:"Fairweather", view:"Fairweather"},{name:"Famous Players", view:"Famous Players"},{name:"Fas Gas", view:"Fas Gas"},{name:"Federated Co-Op", view:"Federated Co-Op"},{name:"Fedex", view:"Fedex"},{name:"Fido Store", view:"Fido Store"},{name:"Fields", view:"Fields"},{name:"First Choice Haircutters", view:"First Choice Haircutters"},{name:"Five Guys Burgers And Fries", view:"Five Guys Burgers And Fries"},{name:"Flight Centre", view:"Flight Centre"},{name:"Food Basics", view:"Food Basics"},{name:"Foodland", view:"Foodland"},{name:"Foodland / Sobeys", view:"Foodland / Sobeys"},{name:"Foodwares", view:"Foodwares"},{name:"Foothills Hospital", view:"Foothills Hospital"},{name:"Footlocker", view:"Footlocker"},{name:"Forever 21", view:"Forever 21"},{name:"Fortinos", view:"Fortinos"},{name:"Fortinos Gas", view:"Fortinos Gas"},{name:"Franx Supreme", view:"Franx Supreme"},{name:"Fresh Mart", view:"Fresh Mart"},{name:"Fresh Slice", view:"Fresh Slice"},{name:"Freshco Grocery", view:"Freshco Grocery"},{name:"Fruits And Passion", view:"Fruits And Passion"},{name:"Gabriel Pizza", view:"Gabriel Pizza"},{name:"Galaxy Cinemas", view:"Galaxy Cinemas"},{name:"Gas Bar", view:"Gas Bar"},{name:"Gateway Newstands", view:"Gateway Newstands"},{name:"Giant Tiger", view:"Giant Tiger"},{name:"Ginos Pizza", view:"Ginos Pizza"},{name:"Gnc", view:"Gnc"},{name:"Golden Griddle", view:"Golden Griddle"},{name:"Groupe Valentine", view:"Groupe Valentine"},{name:"Gucci", view:"Gucci"},{name:"H And M", view:"H And M"},{name:"H&R Block", view:"H&R Block"},{name:"Hallmark", view:"Hallmark"},{name:"Harvey'S", view:"Harvey'S"},{name:"Hasty Market", view:"Hasty Market"},{name:"Hero Burgers", view:"Hero Burgers"},{name:"Hmv", view:"Hmv"},{name:"Holiday Inn", view:"Holiday Inn"},{name:"Home Hardware", view:"Home Hardware"},{name:"Homesense", view:"Homesense"},{name:"Hooters", view:"Hooters"},{name:"Hudson News", view:"Hudson News"},{name:"Husky", view:"Husky"},{name:"Husky Gas Pump", view:"Husky Gas Pump"},{name:"Icbc", view:"Icbc"},{name:"Iga", view:"Iga"},{name:"Ikea", view:"Ikea"},{name:"Imperial Parking (Impark)", view:"Imperial Parking (Impark)"},{name:"Indigo", view:"Indigo"},{name:"Intermarche", view:"Intermarche"},{name:"Ita Nutso", view:"Ita Nutso"},{name:"Japan Camera", view:"Japan Camera"},{name:"Jardin Mobile", view:"Jardin Mobile"},{name:"Jean Coutu", view:"Jean Coutu"},{name:"Jimmy The Greek", view:"Jimmy The Greek"},{name:"Jugo Juice", view:"Jugo Juice"},{name:"Kamasutra", view:"Kamasutra"},{name:"Kawartha Dairy", view:"Kawartha Dairy"},{name:"Kelowna Cab", view:"Kelowna Cab"},{name:"Kelsey'S", view:"Kelsey'S"},{name:"Kernels Popcorn", view:"Kernels Popcorn"},{name:"Kfc", view:"Kfc"},{name:"Kim Chi", view:"Kim Chi"},{name:"Kin'S Farm Market", view:"Kin'S Farm Market"},{name:"Koryo Korean Bbq", view:"Koryo Korean Bbq"},{name:"Koya Japan", view:"Koya Japan"},{name:"La Belle Province", view:"La Belle Province"},{name:"La Cremiere", view:"La Cremiere"},{name:"La Prep", view:"La Prep"},{name:"La Ronde", view:"La Ronde"},{name:"La Vie En Rose", view:"La Vie En Rose"},{name:"Lawtons Drugs", view:"Lawtons Drugs"},{name:"Lcbo", view:"Lcbo"},{name:"Le Chateau", view:"Le Chateau"},{name:"Lettieri", view:"Lettieri"},{name:"Lime", view:"Lime"},{name:"Liquid Nutrition", view:"Liquid Nutrition"},{name:"Little Caesars", view:"Little Caesars"},{name:"Little Short Stop Store", view:"Little Short Stop Store"},{name:"Loblaws Fuel", view:"Loblaws Fuel"},{name:"Loblaws", view:"Loblaws"},{name:"London Drugs", view:"London Drugs"},{name:"Longo'S", view:"Longo'S"},{name:"Loonie Plus", view:"Loonie Plus"},{name:"Louis Vuitton", view:"Louis Vuitton"},{name:"M + M Meat?", view:"M + M Meat?"},{name:"Macewen Petroleum", view:"Macewen Petroleum"},{name:"Mac'S", view:"Mac'S"},{name:"Manchu Wok", view:"Manchu Wok"},{name:"Marble Slab Creamery", view:"Marble Slab Creamery"},{name:"Marcello'S Market", view:"Marcello'S Market"},{name:"Marche Adonis", view:"Marche Adonis"},{name:"Marche Restaurants", view:"Marche Restaurants"},{name:"Marche Richelieu", view:"Marche Richelieu"},{name:"Mark'S Work Wearhouse / L'Equipeur", view:"Mark'S Work Wearhouse / L'Equipeur"},{name:"Marshalls", view:"Marshalls"},{name:"Mary Brown'S Fried Chicken", view:"Mary Brown'S Fried Chicken"},{name:"Maxi", view:"Maxi"},{name:"McDonald's", view:"McDonald's"},{name:"McDonald's Drive Through", view:"McDonald's Drive Through"},{name:"Mega Depot", view:"Mega Depot"},{name:"Menchie'S Frozen Yogurt", view:"Menchie'S Frozen Yogurt"},{name:"Metro Food", view:"Metro Food"},{name:"Mexx", view:"Mexx"},{name:"Michaels", view:"Michaels"},{name:"Michel'S Baguette", view:"Michel'S Baguette"},{name:"Mike'S Restaurant", view:"Mike'S Restaurant"},{name:"Milestone'S", view:"Milestone'S"},{name:"Mohawk", view:"Mohawk"},{name:"Montana'S Cookhouse", view:"Montana'S Cookhouse"},{name:"Moxies Classic Grill", view:"Moxies Classic Grill"},{name:"Mr. Greek", view:"Mr. Greek"},{name:"Mr. Souvlaki", view:"Mr. Souvlaki"},{name:"Mr. Sub", view:"Mr. Sub"},{name:"Mucho Burrito", view:"Mucho Burrito"},{name:"N.Y. Style", view:"N.Y. Style"},{name:"Nando'S Chicken", view:"Nando'S Chicken"},{name:"National Car Rental", view:"National Car Rental"},{name:"New York Fries", view:"New York Fries"},{name:"Nlc", view:"Nlc"},{name:"No Frills", view:"No Frills"},{name:"No Frills Fuel", view:"No Frills Fuel"},{name:"Nslc", view:"Nslc"},{name:"O'Burger", view:"O'Burger"},{name:"Odel Clothing", view:"Odel Clothing"},{name:"On The Go", view:"On The Go"},{name:"Opa Souvlaki", view:"Opa Souvlaki"},{name:"Orange Julius", view:"Orange Julius"},{name:"Overwaitea", view:"Overwaitea"},{name:"Panago Pizza", view:"Panago Pizza"},{name:"Panini", view:"Panini"},{name:"Papa John'S Pizza", view:"Papa John'S Pizza"},{name:"Paramount", view:"Paramount"},{name:"Partsource", view:"Partsource"},{name:"Personal Edge", view:"Personal Edge"},{name:"Petro Canada", view:"Petro Canada"},{name:"Petro Canada Pump", view:"Petro Canada Pump"},{name:"Petro Plus", view:"Petro Plus"},{name:"Petrocelle Clothing", view:"Petrocelle Clothing"},{name:"Petro-T", view:"Petro-T"},{name:"Pharma Plus/Rexall", view:"Pharma Plus/Rexall"},{name:"Pharmacie Brunet", view:"Pharmacie Brunet"},{name:"Pharmasave", view:"Pharmasave"},{name:"Pickle Barrel", view:"Pickle Barrel"},{name:"Pioneer Petroleum", view:"Pioneer Petroleum"},{name:"Pita Pit", view:"Pita Pit"},{name:"Pizza 73", view:"Pizza 73"},{name:"Pizza Delight", view:"Pizza Delight"},{name:"Pizza Hut", view:"Pizza Hut"},{name:"Pizza Nova", view:"Pizza Nova"},{name:"Pizza Pizza", view:"Pizza Pizza"},{name:"Pj'S Pets", view:"Pj'S Pets"},{name:"Place Tevere", view:"Place Tevere"},{name:"Popeye'S Chicken", view:"Popeye'S Chicken"},{name:"Premiere Taxi", view:"Premiere Taxi"},{name:"Presse Cafe", view:"Presse Cafe"},{name:"Price Chopper Canada", view:"Price Chopper Canada"},{name:"Price Smart Foods", view:"Price Smart Foods"},{name:"Provigo", view:"Provigo"},{name:"Public Mobile", view:"Public Mobile"},{name:"Pusateri'S", view:"Pusateri'S"},{name:"Quality Foods", view:"Quality Foods"},{name:"Quality Inn And Suites", view:"Quality Inn And Suites"},{name:"Quiznos", view:"Quiznos"},{name:"Rabba Fine Foods", view:"Rabba Fine Foods"},{name:"Radio Taxi Union", view:"Radio Taxi Union"},{name:"Radisson Hotel", view:"Radisson Hotel"},{name:"Randy River", view:"Randy River"},{name:"Real Canadian Liquorstore", view:"Real Canadian Liquorstore"},{name:"Real Canadian Superstore", view:"Real Canadian Superstore"},{name:"Real Canadian Superstore Fuel", view:"Real Canadian Superstore Fuel"},{name:"Real Canadian Wholesale Club", view:"Real Canadian Wholesale Club"},{name:"Red Robin Restaurant", view:"Red Robin Restaurant"},{name:"Restaurant Normandin", view:"Restaurant Normandin"},{name:"Rexall Pharma Plus", view:"Rexall Pharma Plus"},{name:"Richtree Market", view:"Richtree Market"},{name:"Ricky'S All Day Restaurant", view:"Ricky'S All Day Restaurant"},{name:"Roasters", view:"Roasters"},{name:"Robin'S Donuts", view:"Robin'S Donuts"},{name:"Rocky Mountain Chocolate", view:"Rocky Mountain Chocolate"},{name:"Rogers Wireless", view:"Rogers Wireless"},{name:"Rona", view:"Rona"},{name:"Royal Dutch Shell", view:"Royal Dutch Shell"},{name:"Running Room", view:"Running Room"},{name:"Saaq", view:"Saaq"},{name:"Safeway", view:"Safeway"},{name:"Safeway Fuel", view:"Safeway Fuel"},{name:"Sammy J Peppers Gourmet Grill", view:"Sammy J Peppers Gourmet Grill"},{name:"Saq", view:"Saq"},{name:"Saskatoon Co-Op", view:"Saskatoon Co-Op"},{name:"Save Easy", view:"Save Easy"},{name:"Save On Foods", view:"Save On Foods"},{name:"Saveeasy", view:"Saveeasy"},{name:"Scores Rotisserie Bbq", view:"Scores Rotisserie Bbq"},{name:"Scott'S Discount", view:"Scott'S Discount"},{name:"Sears Canada", view:"Sears Canada"},{name:"Second Cup", view:"Second Cup"},{name:"Sepaq", view:"Sepaq"},{name:"Sephora", view:"Sephora"},{name:"Shell", view:"Shell"},{name:"Sheraton Hotel", view:"Sheraton Hotel"},{name:"Shoeless Joe'S", view:"Shoeless Joe'S"},{name:"Shop Easy", view:"Shop Easy"},{name:"Shopper'S Drug Mart", view:"Shopper'S Drug Mart"},{name:"Snap On Tools", view:"Snap On Tools"},{name:"Sobeys", view:"Sobeys"},{name:"Sobeys Gas", view:"Sobeys Gas"},{name:"South Street Burger", view:"South Street Burger"},{name:"Sport Chek", view:"Sport Chek"},{name:"Staples?", view:"Staples?"},{name:"Starbucks", view:"Starbucks"},{name:"Stitches", view:"Stitches"},{name:"Subway", view:"Subway"},{name:"Sukiyaki", view:"Sukiyaki"},{name:"Sunoco", view:"Sunoco"},{name:"Sunset Grill", view:"Sunset Grill"},{name:"Sunshine Diner", view:"Sunshine Diner"},{name:"Suny'S", view:"Suny'S"},{name:"Super C", view:"Super C"},{name:"Super Save Gas", view:"Super Save Gas"},{name:"Sushi Shop", view:"Sushi Shop"},{name:"Swarovski", view:"Swarovski"},{name:"Swiss Chalet", view:"Swiss Chalet"},{name:"T & T Supermarket", view:"T & T Supermarket"},{name:"Tabagie Du Moulin", view:"Tabagie Du Moulin"},{name:"Tabouli", view:"Tabouli"},{name:"Taco Bell", view:"Taco Bell"},{name:"Taco Time", view:"Taco Time"},{name:"Tandori", view:"Tandori"},{name:"Tcby", view:"Tcby"},{name:"Teriyaki Experience", view:"Teriyaki Experience"},{name:"Thai Express", view:"Thai Express"},{name:"The Beer Store", view:"The Beer Store"},{name:"The Garden Basket", view:"The Garden Basket"},{name:"The Keg", view:"The Keg"},{name:"The Kitchen Table", view:"The Kitchen Table"},{name:"The Men'S Club", view:"The Men'S Club"},{name:"The Source By Circuit City", view:"The Source By Circuit City"},{name:"The Works", view:"The Works"},{name:"Thrifty Foods", view:"Thrifty Foods"},{name:"Tiki Ming", view:"Tiki Ming"},{name:"Tim Hortons", view:"Tim Hortons"},{name:"Timothy'S Coffee", view:"Timothy'S Coffee"},{name:"Tony Roma'S", view:"Tony Roma'S"},{name:"Top Hat Cleaners", view:"Top Hat Cleaners"},{name:"Toronto Parking (Green P)", view:"Toronto Parking (Green P)"},{name:"Toys R Us", view:"Toys R Us"},{name:"Toys Toys Toys", view:"Toys Toys Toys"},{name:"Translink Bc", view:"Translink Bc"},{name:"Travelodge Hotels", view:"Travelodge Hotels"},{name:"Triple O'S", view:"Triple O'S"},{name:"Tutti Frutti", view:"Tutti Frutti"},{name:"Ultramar", view:"Ultramar"},{name:"Underground Clothing", view:"Underground Clothing"},{name:"Uniprix", view:"Uniprix"},{name:"V Vibe", view:"V Vibe"},{name:"Valentine", view:"Valentine"},{name:"Value Village", view:"Value Village"},{name:"Valu-Mart", view:"Valu-Mart"},{name:"Vanelli'S", view:"Vanelli'S"},{name:"Variety Plus", view:"Variety Plus"},{name:"Veggirama", view:"Veggirama"},{name:"Vie & Nam", view:"Vie & Nam"},{name:"Villa Madina", view:"Villa Madina"},{name:"Villa Madina Mediterranean Cuisine", view:"Villa Madina Mediterranean Cuisine"},{name:"Virgin Mobile", view:"Virgin Mobile"},{name:"Vital Planet", view:"Vital Planet"},{name:"Wendy'S", view:"Wendy'S"},{name:"West Coast", view:"West Coast"},{name:"Westin Hotel", view:"Westin Hotel"},{name:"White Spot", view:"White Spot"},{name:"Wild Wing", view:"Wild Wing"},{name:"Wind Mobile", view:"Wind Mobile"},{name:"Wine Rack", view:"Wine Rack"},{name:"Winners", view:"Winners"},{name:"Wyndham Hotels", view:"Wyndham Hotels"},{name:"Yogen Fruz", view:"Yogen Fruz"},{name:"Yogurty'S Frozen Yogurt", view:"Yogurty'S Frozen Yogurt"},{name:"York University", view:"York University"},{name:"Your Dollar Store With More", view:"Your Dollar Store With More"},{name:"Your Independent Grocer", view:"Your Independent Grocer"},{name:"Zara", view:"Zara"},{name:"Zehrs", view:"Zehrs"},{name:"Zehrs Fuel", view:"Zehrs Fuel"}];
  var cityList = [{name:"Acapulco", view:"Acapulco"},{name:"Aguascalientes", view:"Aguascalientes"},{name:"Albuquerque", view:"Albuquerque"},{name:"Apodaca", view:"Apodaca"},{name:"Austin", view:"Austin"},{name:"Baltimore", view:"Baltimore"},{name:"Boston", view:"Boston"},{name:"Brampton", view:"Brampton"},{name:"Calgary", view:"Calgary"},{name:"Cancún", view:"Cancún"},{name:"Carrefour", view:"Carrefour"},{name:"Charlotte", view:"Charlotte"},{name:"Chicago", view:"Chicago"},{name:"Chihuahua", view:"Chihuahua"},{name:"Chimalhuacán", view:"Chimalhuacán"},{name:"Ciudad López Mateos", view:"Ciudad López Mateos"},{name:"Columbus", view:"Columbus"},{name:"Cuautitlán Izcalli", view:"Cuautitlán Izcalli"},{name:"Culiacán", view:"Culiacán"},{name:"Dallas", view:"Dallas"},{name:"Denver", view:"Denver"},{name:"Detroit", view:"Detroit"},{name:"Durango", view:"Durango"},{name:"Ecatepec de Morelos", view:"Ecatepec de Morelos"},{name:"Edmonton", view:"Edmonton"},{name:"El Paso", view:"El Paso"},{name:"Fort Worth", view:"Fort Worth"},{name:"Fresno", view:"Fresno"},{name:"Guadalajara", view:"Guadalajara"},{name:"Guadalupe", view:"Guadalupe"},{name:"Guatemala City", view:"Guatemala City"},{name:"Hamilton", view:"Hamilton"},{name:"Havana", view:"Havana"},{name:"Hermosillo", view:"Hermosillo"},{name:"Houston", view:"Houston"},{name:"Indianapolis", view:"Indianapolis"},{name:"Jacksonville", view:"Jacksonville"},{name:"Juárez", view:"Juárez"},{name:"Kingston", view:"Kingston"},{name:"Las Vegas", view:"Las Vegas"},{name:"León", view:"León"},{name:"Los Angeles", view:"Los Angeles"},{name:"Louisville", view:"Louisville"},{name:"Managua", view:"Managua"},{name:"Memphis", view:"Memphis"},{name:"Mérida", view:"Mérida"},{name:"Mexicali", view:"Mexicali"},{name:"Milwaukee", view:"Milwaukee"},{name:"Mississauga", view:"Mississauga"},{name:"Monterrey", view:"Monterrey"},{name:"Montreal", view:"Montreal"},{name:"Morelia", view:"Morelia"},{name:"Nashville", view:"Nashville"},{name:"Naucalpan", view:"Naucalpan"},{name:"New York City", view:"New York City"},{name:"Nezahualcóyotl", view:"Nezahualcóyotl"},{name:"Oklahoma City", view:"Oklahoma City"},{name:"Ottawa", view:"Ottawa"},{name:"Philadelphia", view:"Philadelphia"},{name:"Phoenix", view:"Phoenix"},{name:"Port-au-Prince", view:"Port-au-Prince"},{name:"Portland", view:"Portland"},{name:"Puebla", view:"Puebla"},{name:"Quebec City", view:"Quebec City"},{name:"Querétaro", view:"Querétaro"},{name:"Reynosa", view:"Reynosa"},{name:"Saltillo", view:"Saltillo"},{name:"San Antonio", view:"San Antonio"},{name:"San Diego", view:"San Diego"},{name:"San Francisco", view:"San Francisco"},{name:"San Jose", view:"San Jose"},{name:"San Luis Potosí", view:"San Luis Potosí"},{name:"San Pedro Sula", view:"San Pedro Sula"},{name:"Santiago de los Caballeros", view:"Santiago de los Caballeros"},{name:"Santo Domingo", view:"Santo Domingo"},{name:"Seattle", view:"Seattle"},{name:"Surrey", view:"Surrey"},{name:"Tegucigalpa", view:"Tegucigalpa"},{name:"Tijuana", view:"Tijuana"},{name:"Tlalnepantla", view:"Tlalnepantla"},{name:"Tlaquepaque", view:"Tlaquepaque"},{name:"Toluca", view:"Toluca"},{name:"Tonalá", view:"Tonalá"},{name:"Toronto", view:"Toronto"},{name:"Torreón", view:"Torreón"},{name:"Tucson", view:"Tucson"},{name:"Tultitlán", view:"Tultitlán"},{name:"Tuxtla Gutiérrez", view:"Tuxtla Gutiérrez"},{name:"Vancouver", view:"Vancouver"},{name:"Veracruz", view:"Veracruz"},{name:"Villa Nueva", view:"Villa Nueva"},{name:"Washington, D.C.", view:"Washington, D.C."},{name:"Winnipeg", view:"Winnipeg"},{name:"Zapopan", view:"Zapopan"}];
  var csvEntry = [['Store Name','Address','City','Date','Time','Device Type','Bank Name','PassFail','Number of Attempts','Card Type','User Comments','Serial Number','Passbook UI','Reader Light','Technology Available','Contactless Card','Contactless Card Pass Fail','Last Four','PNO','LAT-LONG','Fail Comments','DPAN','Amount','SW Build','Refund','Status','Other Comments','Other Fail Comments','Product Item Category','Product Item Details','Reader Beep','Zip Code','Minor City','Range','Debit Asked Pin','Passbook Notification','Device Orientation','Display Merchant Name','Display Amount','Country']];
  var entryCounter = 1;


});


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

myapp.controller('myController', function ($scope, $cordovaFile, $ionicPopup) {
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

  $scope.getTestItems = function (query, option) {
    $cordovaFile.readAsText(cordova.file.externalDataDirectory, 'storeName.txt')
      .then(function (success) {
        $scope.storeName = success;
      }, function (error) {
        alert('file is empty ');// error
      });

    if(option ==1) {
      var data = {items: storeList};
    }
    else if(option ==2) {
      data = {items: cityList};
    }
    var viewArray = [];

    for(var i=0; i <data.items.length; i++) {
      if (data.items[i].view.toLowerCase().indexOf(query.toLowerCase()) >= 0 && query !== '') {
        viewArray.push({view: data.items[i].view});
      }
    }

    for(var i=0; i <data.items.length; i++) {
      if (data.items[i].view.toLowerCase().indexOf(query.toLowerCase()) < 0 && query !== '') {
        viewArray.push({view: query});

        $cordovaFile.writeFile(cordova.file.externalDataDirectory, 'storeName.txt', query, true)
          .then(function (success) {
            console.log('store name saved'); // success
          }, function (error) {
            console.log('file write error'); // error
          });
        break;
      }
    } //if no match, return whatever query is

    return subdata = {items: viewArray}; //get all partial match

  };

//////////////Save to csvEntry////////////////////
  $scope.saveToCsvEntry = function () {

  };

  var storeList = [{view:"2 For 1 Pizza"},{view:"7-Eleven"},{view:"A And P"},{view:"A And W"},{view:"A Buck Or Two"},{view:"A G A Variety"},{view:"Abc Country Restaurant"},{view:"Aeropostale"},{view:"Alcool Nb Liquor"},{view:"Aldo"},{view:"Alimentation"},{view:"Amco"},{view:"American Apparel"},{view:"Amir Restaurant"},{view:"Arby's"},{view:"Aritzia"},{view:"Atlantic Superstore"},{view:"Atlantic Superstore Fuel"},{view:"Au Vieux Duluth Express"},{view:"Avondale Foods"},{view:"Baskin Robbins"},{view:"Baton Rouge"},{view:"Bc Liquor"},{view:"Bean Around The World"},{view:"Bell World"},{view:"Benson Autoparts"},{view:"Bentley"},{view:"Best Buy"},{view:"Best Western Hotel"},{view:"Big Bee Convenience"},{view:"Bistro Van Houtte"},{view:"Black's Photo"},{view:"Blenz Coffee"},{view:"Blue Mountain"},{view:"Booster Juice"},{view:"Boston Pizza"},{view:"Boys' Co. Clothing"},{view:"Brunet Pharmacy"},{view:"Bubble Tease"},{view:"Buffalo"},{view:"Bulk Barn"},{view:"Burberry"},{view:"Burger King"},{view:"Burrito Boyz"},{view:"Buy Low Foods"},{view:"Byob"},{view:"Cafe Depot"},{view:"Cafe Supreme"},{view:"Caferama"},{view:"Calendar Club"},{view:"Canada Post"},{view:"Canada Safeway"},{view:"Canada's Wonderland"},{view:"Canadian Tire"},{view:"Canadian Tire Petroleum"},{view:"Casa Grecque"},{view:"Casey's"},{view:"Cash & Carry"},{view:"Centre De Service Auto"},{view:"Chapters"},{view:"Chartwells"},{view:"Chez Ashton"},{view:"Chez Tante Marie"},{view:"Chicknchick"},{view:"Church's Chicken"},{view:"Cineplex"},{view:"Cinnabon"},{view:"Clini Plus"},{view:"Clipper Cafe"},{view:"Club"},{view:"Cobs Bread"},{view:"Coconuts Restaurant"},{view:"Coffee Time"},{view:"Coles"},{view:"Collinson Convenience"},{view:"Comfort Inn"},{view:"Continental Currency"},{view:"Costco"},{view:"Couche Tard"},{view:"Country Style"},{view:"Coyote Jack's"},{view:"Crabby Joe's"},{view:"Crevier"},{view:"Croissant Plus"},{view:"Cultures"},{view:"Dagwoods Sandwichs Et Salades"},{view:"Dairy Queen"},{view:"Dairy Queen/Orange Julius"},{view:"Daisy Mart"},{view:"Denny's"},{view:"Depanneur 7 Jours"},{view:"Depanneur Boni Soir"},{view:"Discount Car Rental"},{view:"Dollar Tree"},{view:"Dominion"},{view:"Domino's Pizza"},{view:"Domo Gasoline"},{view:"Dunkin Donuts"},{view:"Earl's"},{view:"East Side Mario's"},{view:"Easy Financial Services"},{view:"Easy Home Lease-To-Own"},{view:"Eb Games"},{view:"Eclipse"},{view:"Edo Japan"},{view:"Eggsmart"},{view:"Eglinton Cafe"},{view:"Electronic Arts"},{view:"Enterprise Rent A Car"},{view:"Esso"},{view:"Extra Foods"},{view:"Extreme Pita"},{view:"Fabricland"},{view:"Fairweather"},{view:"Famous Players"},{view:"Fas Gas"},{view:"Federated Co-Op"},{view:"Fedex"},{view:"Fido Store"},{view:"Fields"},{view:"First Choice Haircutters"},{view:"Five Guys Burgers And Fries"},{view:"Flight Centre"},{view:"Food Basics"},{view:"Foodland"},{view:"Foodland / Sobeys"},{view:"Foodwares"},{view:"Foothills Hospital"},{view:"Footlocker"},{view:"Forever 21"},{view:"Fortinos"},{view:"Fortinos Gas"},{view:"Franx Supreme"},{view:"Fresh Mart"},{view:"Fresh Slice"},{view:"Freshco Grocery"},{view:"Fruits And Passion"},{view:"Gabriel Pizza"},{view:"Galaxy Cinemas"},{view:"Gas Bar"},{view:"Gateway Newstands"},{view:"Giant Tiger"},{view:"Ginos Pizza"},{view:"Gnc"},{view:"Golden Griddle"},{view:"Groupe Valentine"},{view:"Gucci"},{view:"H And M"},{view:"H&R Block"},{view:"Hallmark"},{view:"Harvey's"},{view:"Hasty Market"},{view:"Hero Burgers"},{view:"Hmv"},{view:"Holiday Inn"},{view:"Home Hardware"},{view:"Homesense"},{view:"Hooters"},{view:"Hudson News"},{view:"Husky"},{view:"Husky Gas Pump"},{view:"Icbc"},{view:"Iga"},{view:"Ikea"},{view:"Imperial Parking (Impark)"},{view:"Indigo"},{view:"Intermarche"},{view:"Ita Nutso"},{view:"Japan Camera"},{view:"Jardin Mobile"},{view:"Jean Coutu"},{view:"Jimmy The Greek"},{view:"Jugo Juice"},{view:"Kamasutra"},{view:"Kawartha Dairy"},{view:"Kelowna Cab"},{view:"Kelsey's"},{view:"Kernels Popcorn"},{view:"Kfc"},{view:"Kim Chi"},{view:"Kin's Farm Market"},{view:"Koryo Korean Bbq"},{view:"Koya Japan"},{view:"La Belle Province"},{view:"La Cremiere"},{view:"La Prep"},{view:"La Ronde"},{view:"La Vie En Rose"},{view:"Lawtons Drugs"},{view:"Lcbo"},{view:"Le Chateau"},{view:"Lettieri"},{view:"Lime"},{view:"Liquid Nutrition"},{view:"Little Caesars"},{view:"Little Short Stop Store"},{view:"Loblaws Fuel"},{view:"Loblaws"},{view:"London Drugs"},{view:"Longo's"},{view:"Loonie Plus"},{view:"Louis Vuitton"},{view:"M + M Meat?"},{view:"Macewen Petroleum"},{view:"Mac's"},{view:"Manchu Wok"},{view:"Marble Slab Creamery"},{view:"Marcello's Market"},{view:"Marche Adonis"},{view:"Marche Restaurants"},{view:"Marche Richelieu"},{view:"Mark's Work Wearhouse / L'Equipeur"},{view:"Marshalls"},{view:"Mary Brown's Fried Chicken"},{view:"Maxi"},{view:"McDonald's"},{view:"McDonald's Drive Through"},{view:"Mega Depot"},{view:"Menchie's Frozen Yogurt"},{view:"Metro Food"},{view:"Mexx"},{view:"Michaels"},{view:"Michel's Baguette"},{view:"Mike's Restaurant"},{view:"Milestone's"},{view:"Mohawk"},{view:"Montana's Cookhouse"},{view:"Moxies Classic Grill"},{view:"Mr. Greek"},{view:"Mr. Souvlaki"},{view:"Mr. Sub"},{view:"Mucho Burrito"},{view:"N.Y. Style"},{view:"Nando's Chicken"},{view:"National Car Rental"},{view:"New York Fries"},{view:"Nlc"},{view:"No Frills"},{view:"No Frills Fuel"},{view:"Nslc"},{view:"O'Burger"},{view:"Odel Clothing"},{view:"On The Go"},{view:"Opa Souvlaki"},{view:"Orange Julius"},{view:"Overwaitea"},{view:"Panago Pizza"},{view:"Panini"},{view:"Papa John's Pizza"},{view:"Paramount"},{view:"Partsource"},{view:"Personal Edge"},{view:"Petro Canada"},{view:"Petro Canada Pump"},{view:"Petro Plus"},{view:"Petrocelle Clothing"},{view:"Petro-T"},{view:"Pharma Plus/Rexall"},{view:"Pharmacie Brunet"},{view:"Pharmasave"},{view:"Pickle Barrel"},{view:"Pioneer Petroleum"},{view:"Pita Pit"},{view:"Pizza 73"},{view:"Pizza Delight"},{view:"Pizza Hut"},{view:"Pizza Nova"},{view:"Pizza Pizza"},{view:"Pj's Pets"},{view:"Place Tevere"},{view:"Popeye's Chicken"},{view:"Premiere Taxi"},{view:"Presse Cafe"},{view:"Price Chopper Canada"},{view:"Price Smart Foods"},{view:"Provigo"},{view:"Public Mobile"},{view:"Pusateri's"},{view:"Quality Foods"},{view:"Quality Inn And Suites"},{view:"Quiznos"},{view:"Rabba Fine Foods"},{view:"Radio Taxi Union"},{view:"Radisson Hotel"},{view:"Randy River"},{view:"Real Canadian Liquorstore"},{view:"Real Canadian Superstore"},{view:"Real Canadian Superstore Fuel"},{view:"Real Canadian Wholesale Club"},{view:"Red Robin Restaurant"},{view:"Restaurant Normandin"},{view:"Rexall Pharma Plus"},{view:"Richtree Market"},{view:"Ricky's All Day Restaurant"},{view:"Roasters"},{view:"Robin's Donuts"},{view:"Rocky Mountain Chocolate"},{view:"Rogers Wireless"},{view:"Rona"},{view:"Royal Dutch Shell"},{view:"Running Room"},{view:"Saaq"},{view:"Safeway"},{view:"Safeway Fuel"},{view:"Sammy J Peppers Gourmet Grill"},{view:"Saq"},{view:"Saskatoon Co-Op"},{view:"Save Easy"},{view:"Save On Foods"},{view:"Saveeasy"},{view:"Scores Rotisserie Bbq"},{view:"Scott's Discount"},{view:"Sears Canada"},{view:"Second Cup"},{view:"Sepaq"},{view:"Sephora"},{view:"Shell"},{view:"Sheraton Hotel"},{view:"Shoeless Joe's"},{view:"Shop Easy"},{view:"Shopper's Drug Mart"},{view:"Snap On Tools"},{view:"Sobeys"},{view:"Sobeys Gas"},{view:"South Street Burger"},{view:"Sport Chek"},{view:"Staples?"},{view:"Starbucks"},{view:"Stitches"},{view:"Subway"},{view:"Sukiyaki"},{view:"Sunoco"},{view:"Sunset Grill"},{view:"Sunshine Diner"},{view:"Suny's"},{view:"Super C"},{view:"Super Save Gas"},{view:"Sushi Shop"},{view:"Swarovski"},{view:"Swiss Chalet"},{view:"T & T Supermarket"},{view:"Tabagie Du Moulin"},{view:"Tabouli"},{view:"Taco Bell"},{view:"Taco Time"},{view:"Tandori"},{view:"Tcby"},{view:"Teriyaki Experience"},{view:"Thai Express"},{view:"The Beer Store"},{view:"The Garden Basket"},{view:"The Keg"},{view:"The Kitchen Table"},{view:"The Men's Club"},{view:"The Source By Circuit City"},{view:"The Works"},{view:"Thrifty Foods"},{view:"Tiki Ming"},{view:"Tim Hortons"},{view:"Timothy's Coffee"},{view:"Tony Roma's"},{view:"Top Hat Cleaners"},{view:"Toronto Parking (Green P)"},{view:"Toys R Us"},{view:"Toys Toys Toys"},{view:"Translink Bc"},{view:"Travelodge Hotels"},{view:"Triple O's"},{view:"Tutti Frutti"},{view:"Ultramar"},{view:"Underground Clothing"},{view:"Uniprix"},{view:"V Vibe"},{view:"Valentine"},{view:"Value Village"},{view:"Valu-Mart"},{view:"Vanelli's"},{view:"Variety Plus"},{view:"Veggirama"},{view:"Vie & Nam"},{view:"Villa Madina"},{view:"Villa Madina Mediterranean Cuisine"},{view:"Virgin Mobile"},{view:"Vital Planet"},{view:"Wendy's"},{view:"West Coast"},{view:"Westin Hotel"},{view:"White Spot"},{view:"Wild Wing"},{view:"Wind Mobile"},{view:"Wine Rack"},{view:"Winners"},{view:"Wyndham Hotels"},{view:"Yogen Fruz"},{view:"Yogurty's Frozen Yogurt"},{view:"York University"},{view:"Your Dollar Store With More"},{view:"Your Independent Grocer"},{view:"Zara"},{view:"Zehrs"},{view:"Zehrs Fuel"},]
  var cityList = [{view:"Acapulco"},{view:"Aguascalientes"},{view:"Albuquerque"},{view:"Apodaca"},{view:"Austin"},{view:"Baltimore"},{view:"Boston"},{view:"Brampton"},{view:"Calgary"},{view:"Cancún"},{view:"Carrefour"},{view:"Charlotte"},{view:"Chicago"},{view:"Chihuahua"},{view:"Chimalhuacán"},{view:"Ciudad López Mateos"},{view:"Columbus"},{view:"Cuautitlán Izcalli"},{view:"Culiacán"},{view:"Dallas"},{view:"Denver"},{view:"Detroit"},{view:"Durango"},{view:"Ecatepec de Morelos"},{view:"Edmonton"},{view:"El Paso"},{view:"Fort Worth"},{view:"Fresno"},{view:"Guadalajara"},{view:"Guadalupe"},{view:"Guatemala City"},{view:"Hamilton"},{view:"Havana"},{view:"Hermosillo"},{view:"Houston"},{view:"Indianapolis"},{view:"Jacksonville"},{view:"Juárez"},{view:"Kingston"},{view:"Las Vegas"},{view:"León"},{view:"Los Angeles"},{view:"Louisville"},{view:"Managua"},{view:"Memphis"},{view:"Mérida"},{view:"Mexicali"},{view:"Milwaukee"},{view:"Mississauga"},{view:"Monterrey"},{view:"Montreal"},{view:"Morelia"},{view:"Nashville"},{view:"Naucalpan"},{view:"New York City"},{view:"Nezahualcóyotl"},{view:"Oklahoma City"},{view:"Ottawa"},{view:"Philadelphia"},{view:"Phoenix"},{view:"Port-au-Prince"},{view:"Portland"},{view:"Puebla"},{view:"Quebec City"},{view:"Querétaro"},{view:"Reynosa"},{view:"Saltillo"},{view:"San Antonio"},{view:"San Diego"},{view:"San Francisco"},{view:"San Jose"},{view:"San Luis Potosí"},{view:"San Pedro Sula"},{view:"Santiago de los Caballeros"},{view:"Santo Domingo"},{view:"Seattle"},{view:"Surrey"},{view:"Tegucigalpa"},{view:"Tijuana"},{view:"Tlalnepantla"},{view:"Tlaquepaque"},{view:"Toluca"},{view:"Tonalá"},{view:"Toronto"},{view:"Torreón"},{view:"Tucson"},{view:"Tultitlán"},{view:"Tuxtla Gutiérrez"},{view:"Vancouver"},{view:"Veracruz"},{view:"Villa Nueva"},{view:"Washington, D.C."},{view:"Winnipeg"},{view:"Zapopan"},];
  var csvEntry = [['Store Name','Address','City','Date','Time','Device Type','Bank Name','PassFail','Number of Attempts','Card Type','User Comments','Serial Number','Passbook UI','Reader Light','Technology Available','Contactless Card','Contactless Card Pass Fail','Last Four','PNO','LAT-LONG','Fail Comments','DPAN','Amount','SW Build','Refund','Status','Other Comments','Other Fail Comments','Product Item Category','Product Item Details','Reader Beep','Zip Code','Minor City','Range','Debit Asked Pin','Passbook Notification','Device Orientation','Display Merchant Name','Display Amount','Country']];
  var entryCounter = 1;
});


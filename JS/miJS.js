var loginError='<div class="loginAlerts"><div class="alert alert-danger"><strong>Error!</strong> Incorrect email or password, try again.</div></div>';
var emailError='<div class="loginAlerts"><div class="alert alert-danger"><strong>Error!</strong> Invalid email, try again.</div></div>';
var connectionError='<div class="loginAlerts"><div class="alert alert-danger"><strong> Cannot connect! </strong>Check your internet connection or try again later.</div></div>';
var mailError="<div class='loginAlerts'><div class='alert alert-danger'><strong>Email error!</strong> The email already exist, try with another one.</div></div>";
var emptyError="<div class='loginAlerts'><div class='alert alert-danger'><strong>Error!</strong> You need fill up all the information in order to create a new account.</div></div>";
var loginSuccess='<div class="loginAlerts"><div class="alert alert-success"><strong>Success!</strong> Thank you for coming back. Welcome!</div></div>';
var photoSuccess='<div class="loginAlerts"><div class="alert alert-success"><strong>Success!</strong> Your photo has been changed</div></div>';
var createSuccess='<div class="loginAlerts"><div class="alert alert-success"><strong>Success!</strong> Now you can login with your new account. Try it!</div></div>';
var passwords="<div class='loginAlerts'><div class='alert alert-danger'><strong>Password error!</strong> The password don't match, try again.</div></div>";
var emailSent="<div class='loginAlerts'><div class='alert alert-success'><strong>Success!</strong> We have sent you the account details.</div></div>";
var emailTip="<div class='loginAlerts'  ><div class='alert alert-info'><strong>Forgot your password?</strong><br>Enter your email. <br>Wait for your recovery details to be sent</div></div>"
var donate="http://www.centerofhope-haiti.org/donate-form";
var userId;
var retries = 0;
var sponsorLink="http://www.gyosolutions.com/";
var logged=false;
function onBodyLoad()
{    
	document.addEventListener("deviceready", onDeviceReady, false);
}
function onDeviceReady()
{
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 2000);
    getSponsor();
    window.plugin.statusbarOverlay.hide();
	 //preparamos los elementos activos de la app
	  $("#btnGetCamara").click(function(e){
		e.stopPropagation();
			navigator.camera.getPicture( cameraSuccess, cameraError, { quality : 50,
														destinationType : Camera.DestinationType.FILE_URI,
														sourceType : Camera.PictureSourceType.CAMERA,
														allowEdit : true,
														encodingType: Camera.EncodingType.JPEG,
																	  saveToPhotoAlbum: true } );
	});
	
	$("#btnGetLibrary").click(function(e){
            e.stopPropagation();
			navigator.camera.getPicture( cameraSuccess, cameraError, { quality : 50,
														destinationType : Camera.DestinationType.FILE_URI,
														sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
														allowEdit : true,
														encodingType: Camera.EncodingType.JPEG,
														saveToPhotoAlbum: true 
		} );
	});
}
function cameraSuccess(imageURI) 
{

    
						//Recibes el link a la foto dentro del telefono.
						// Mostrar la foto en un img en el html document.getElementById("fotoEdit_img").src = imageURI;
						
						//Crear las opciones que necesita para hacer el FileUpload
                        
                                var options = new FileUploadOptions();

						
						//Le tienes que hacer un EncodeUri al url del PHP
						var url=encodeURI("http://www.gyo-solutions.com/carlos/COHH/movil/php/uploadPhoto.php");
                        options.fileKey="file";
                        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                        options.mimeType="image/jpeg";
                        options.chunkedMode = false;
                        options.headers = {
                           Connection: "close"
                        };
                        // setup parameters
                        var params = {};
                        params.fullpath =imageURI;
                        params.name = options.fileName; 
                        params.id=userId;
						options.params = params;
                        var ft = new FileTransfer();
						//Realizas la funcion de upload, con la llamada de callback a win si es succes y fail si hubo un error.
                        ft.upload(imageURI, url, win, fail, options);
 			function win(r) 
            {
                getProfile();
                
                changeContent(photoSuccess);
            }
            
			function fail(error) 
			{
                
				if (retries == 0) 
				{
					
					retries ++;
					setTimeout(function() 
					{
						cameraSuccess(imageURI);
					}, 1000)
				} 
				else 
				{
					retries = 0;
					clearCache();
                    changeContent(connectionError);
				
				}
    		}
}
function cameraError()
{
    //alert("camera not working");
}
function logIn()
{
    /*var email=document.getElementById("email");
    email=email.value;
    var password=document.getElementById("password");
    password=password.value;
    if(isValidEmailAddress(email))
    {
        $.ajax({
            type        : "POST",
            url         : "http://www.gyo-solutions.com/carlos/COHH/movil/php/verifyUser.php",
            data        :{email:email, password:password},
            crossDomain : true,
            success     :function(data)
            {		
                result=data.split('&&&');
                if(result[0]=="win")
                {
                    userId=result[1];
                    getProfile();
                    $("#errorLogin").html(loginSuccess);
                    location.href="#homePage";   
                    logged=true;
                    slideBarContent();
                }
                else
                {
                    $("#errorLogin").html(loginError);
                    
                }
            },
            error       :function() 
            {
                $("#errorLogin").html(connectionError);
            }
        });
    }
    else
    {
        $("#errorLogin").html(loginError);
    }*/
    $.mobile.navigate("homePage");

}
function logOut()
{
    location.href="#logInPage";
    logged=false;
    slideBarContent();
}
function slideBarContent()
{
    var loggedContent=document.getElementById("loggedSidebar").innerHTML;
    var topSidebar=document.getElementById("loginSideBar").innerHTML;
    var noLoggedContent=document.getElementById("notLoggedSidebar").innerHTML;
    
     if(logged)
     {
         $("#loginSideBar").html(loggedContent);
     }
    else
    {
        $("#loginSideBar").html(noLoggedContent);
    }
}
function initialContent()       
{
    getProjectsRss();
}
function showMyProfile()
{
    var content=document.getElementById("myProfile").innerHTML;
    changeContent(content);
}
function getProjectsRss()
{
    $( "#homePageContent" ).animate({
        opacity: 0.01,
        }, 150, function() 
        {
            $.ajax({
            type        : "POST",
            url: "http://gyo-solutions.com/carlos/COHH/movil/php/getProjectsRss.php",
            crossDomain : true,
            success     :function(data)
            {		
                showProjects(data);
            },
            error       :function() 
            {
                changeContent(connectionError);
            }
        });
        });
}
function showProjects(json)
{
    var feed=JSON.parse(json);
    var title="", description, pubDate;
    var div
    var toShow="";
    var noError=true;
    var encodeBody;
    var i=0;
    var date;
    toShow='<h2 class="titleSection">To Keep You Informed</h2>';
    while(i<10)
    {   
        if(feed.projects[i].Title!=null)
        {
            description=urldecode(feed.projects[i].Body);
            photo=feed.projects[i].Photo;
            pubDate=feed.projects[i].PubDate;
            link=feed.projects[i].Link;
            pubDate=pubDate.split(" ");
            date=pubDate[2]+" "+pubDate[1]+" "+pubDate[3]+".";
            link="'"+link+"'";
            donate="'"+donate+"'";
            div='<div class="projectFeed"><h3 class="projectTitle">'+feed.projects[i].Title+'</h3><div  ><div class="right"><img class="projectImg" src="'+photo+'"/></div><div class="left"><img src="Images/readMore.png" class="readImg" onClick="inAppBrowser('+link+')"/></div></div><br><br><br><br><h6 class="projectDate">'+date+'</h6></div>';
            toShow=toShow+div;
            i++;
        }
        else
        {
            noError=false;
        }
    }
    changeContent(toShow);
}
function getProfile()
{
    
    $.ajax({
            type        : "POST",
            url         : "http://www.gyo-solutions.com/carlos/COHH/movil/php/getProfile.php",
            data        :{id:userId},
            crossDomain : true,
            success     :function(data)
            {		
                result=data.split('&&&');
                if(result[0]=="win")
                {
                    setProfile(data);
                }
                else
                {
                    changeContent(connectionError);
                    
                }
            },
            error       :function() 
            {
                changeContent(connectionError);
            }
        });
}
function setProfile(data)
{
    var elements=data.split("&&&");
    var userName=elements[1];
    var userEmail=elements[2];
    var userCountry=elements[3];
    var userPhoto=elements[4];
    var slidePhoto=document.getElementById("slidePhoto");
    var profilePhoto=document.getElementById("profilePhoto");
    var slideName=document.getElementById("slideName");
    var modalImag=document.getElementById("modalImg");
    var profileName=document.getElementById("profileName");
    var profileCountry=document.getElementById("profileCountry");
    var profileEmail=document.getElementById("profileEmail");
    var slide=document.getElementById("slideContent");
    if(userPhoto!="fail")
    {
        profilePhoto.src=userPhoto;
        modalImag.src=userPhoto;
        slidePhoto.src=userPhoto;
    }
    else 
    {
        profilePhoto.src="Images/user.png";
        slidePhoto.src="Images/user.png";
        modalImagsrc="Images/user.png";
    }
    slideContent="<img class='userPhoto' id='slidePhoto' src='"+slidePhoto+"' style='max-width: 51.54%;  pointer-events: auto; margin-left: -3px; margin-top: 0px;'><h6>"+userName+"</h6>";
    $(slide).html(slideContent);
    $("#slideName").html(userName);
    $(profileName).html(userName);
    $(profileEmail).html(userEmail);
    $(profileCountry).html(userCountry);
}
function showWhoAreWe()
{
    var content=document.getElementById("whoAreWe").innerHTML;
    changeContent(content);
}
function showContact()
{
    var content=document.getElementById("contact").innerHTML;
    changeContent(content);
}
function showBlog()
{
    var content=document.getElementById("blog").innerHTML;
    changeContent(content);
}
function showNetworkFeeds()
{
    var title='<h2 class="titleSection">Social</h2>';
    var content=document.getElementById("networkFeeds").innerHTML;
    var toShow=title+content;
    changeContent(toShow);
}
function showSettings()
{
    var content=document.getElementById("settings").innerHTML;
    changeContent(content);
}
function showTheSchoolProject()
{
    var content=document.getElementById("theSchoolProject").innerHTML;
    changeContent(content);
}
function showAchievements()
{
    var content=document.getElementById("achievements").innerHTML;
    changeContent(content);
}
function showSearchProject()
{
    var content=document.getElementById("searchProject").innerHTML;
    changeContent(content);
}
function showFormAddUser()
{
    var content=document.getElementById("formAddUser").innerHTML;
    $("#logInContent").html(content);
}
function showOriginalLogIn()
{
    var content=document.getElementById("originalLogIn").innerHTML;
    $("#logInContent").html(content);
}
function submitUser()
{
    logIn();
    location.href="#homePage";
    initialContent();
}
function getYoutubeFeed()
{
    $.ajax({
            type        : "POST",
            url: "http://gyo-solutions.com/carlos/COHH/movil/php/getGPFeed.php",
            crossDomain : true,
            success     :function(data)
            {		
                showYTFeed(data);
            },
            error       :function() 
            {
                changeContent(connectionError);
            }
        });
}
function showYTFeed(json)
{
    var feed=JSON.parse(json);
    var title="", description, pubDate;
    var div;
    var toShow="";
    var noError=true;
    var encodeBody;
    var i=0;
    while(i<9)
    {   
        if(feed.projects[i].Title!=null)
        {
            photo=feed.projects[i].Photo;
            pubDate=feed.projects[i].PubDate;
            link=urldecode(feed.projects[i].Link);
            link=link.split("&feature");
            url="'"+link[0]+"'";
            pubDate=pubDate.split(" ");
            date=pubDate[2]+" "+pubDate[1]+" "+pubDate[3]+".";
            div='<div onClick="movilBrowser('+url+')" class="ytFeed"><div class="right"><img class="ytImg" src="'+photo+'"/></div><div class="left"> <h3 class="ytTitle">'+feed.projects[i].Title+'</h3></div><h3 class="ytDate">'+date+'</h3></div>';
            toShow=toShow+div;
            i++;
        }
        else
        {
            noError=false;
        }
    }
    changeContent(toShow);
}
function urldecode(str)
{
   var url=decodeURIComponent((str+'').replace("%20", " ").replace("%26","&").replace("%3b",";").replace("+"," "));
    url.replace("+"," ");
    return url;
}
function movilBrowser(url)
{

    ulr='"'+url+'"';
    //navigator.app.loadUrl(url, {openExternarl:true});
    window.open(url,'_system');
    
}
function goToDonate()
{
    url="http://www.centerofhope-haiti.org/donate-form";
    //navigator.app.loadUrl(url, {openExternarl:true});
    window.open(url,'_system');
    
}
function inAppBrowser(url)
{

    window.open(url,"_blank", "location=no");
}
function createUser()
{
    var name= document.getElementById("nameTC");
    name=name.value;
    var date= document.getElementById("dateTC");
    date=date.value;
    var country=document.getElementById("countryTC");
    country=country.value;
    var email=document.getElementById("emailTC");
    email=email.value;
    var password=document.getElementById("passwordTC");
    password=password.value;
    var checkPassword=document.getElementById("rptPasswordTC");
    checkPassword=checkPassword.value;
    var checkBox=document.getElementById("newsletterCheck");
    if(checkBox.checked)
    {
        checkBox=1;
    }
    else 
    {
        checkBox=0;
    }
    var myData={name:name, birthDay:date, country:country, email:email, password:password, newsletter:checkBox};
    
    if(name!=""&&date!=""&&country!=""&&email!=""&&password!=""&&checkPassword!="")
    {
        if(isValidEmailAddress(email))
        {
            if(checkPassword==password)
            {    
                $.ajax({
                    type        : "POST",
                    url         : "http://gyo-solutions.com/carlos/COHH/movil/php/addUser.php",
                    crossDomain : true,
                    data        : myData,
                    success     :function(data)
                    {		
                        if(data==1)
                        {
                            $("#errorLogin").html(connectionError);
                        }
                        else if(data==2)
                        {
                            $("#errorLogin").html(mailError);
                        }
                        else if(data=="win")
                        {
                            $("#errorLogin").html(createSuccess);
                            ereaseLoginForm();
                            interactMenu();
                        }
                        else 
                        {
                            $("#errorLogin").html(connectionError);
                        }
                    },
                    error       :function() 
                    {
                        $("#errorLogin").html(connectionError);
                    }
                });
            }
            else
            {
                $("#errorLogin").html(passwords);

}
        }
        else 
        {
            $("#errorLogin").html(loginError);
        }
    }
    else
    {
        $("#errorLogin").html(emptyError);
    }
}
function ereaseLoginForm()
{
    var name= document.getElementById("nameTC");
    name.value="";
    var date= document.getElementById("dateTC");
    date.value="";
    var country=document.getElementById("countryTC");
    country.value="";
    var email=document.getElementById("emailTC");
    email.value="";
    var password=document.getElementById("passwordTC");
    password.value="";
    var checkPassword=document.getElementById("rptPasswordTC");
    checkPassword.value="";
}
$(window).load(function(){
  $("[data-toggle]").click(function() {
    var toggle_el = $(this).data("toggle");
    var header=$("header").data("uid");
    moveHeader();
    $(toggle_el).toggleClass("open-sidebar");
  });
    
});//]]>  
var moved=false;
function moveHeader()
{
    var header=document.getElementById("homePageHeader"); 
    if(moved)
    {  
        $(header).addClass("closeHeader");
        $(header).addClass("positionHeader");
        moved=false;
    }
    else
    {
        $(header).addClass("openHeader");
        $(header).addClass("positionHeader");
        moved=true;
    }

}
function getSponsor()
{
    $.ajax({
            type        : "POST",
            url         : "http://www.gyo-solutions.com/carlos/COHH/movil/php/getSponsor.php",
            data        :{id:userId},
            crossDomain : true,
            success     :function(data)
            {		
                setSponsor(data);
            },
            error       :function() 
            {
                setSponsor("fail");
            }
        });
    
}
function setSponsor(data)
{

    var result=data.split("&&&");
    var slideImg=document.getElementById("sponsorImg");
    
    if(result[0]=="win")
    {
        var img=result[1];
        sponsorLink=result[2];
        slideImg.src=img;
    }
}
function sponsorWeb()
{
    movilBrowser(sponsorLink);
}
function forgotPassword()
{
    var email=document.getElementById("forgotEmail");
    email=email.value;
    var char=email.length;
    if(char>0)
    {
        if(isValidEmailAddress(email))
        {
            $.ajax({
                type        : "POST",
                url         : "http://www.gyo-solutions.com/carlos/COHH/movil/php/forgotPassword.php",
                data        :{email:email},
                crossDomain : true,
                success     :function(data)
                {		
                    $("#forgotSuccess").html(emailSent);
                    $("#forgotError").html("");
                    
                },
                error       :function() 
                {
                    $("#forgotError").html(connectionError);
                    $("#forgotSuccess").html("");

                }
            });
        }
        else
        {
            $("#forgotError").html(emailError);
             $("#forgotSuccess").html("");
        }
    }
    else
    {
        $("#forgotSuccess").html(emailTip);
        $("#forgotError").html("");
        
    }
}
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}

function changeContent(content)
{
      $( "#homePageContent" ).animate({
        opacity: 0.01,
        }, 150, function() 
        {
            $("#homePageContent").html(content);
                  $( "#homePageContent" ).animate({
                    opacity: 1,
                    },300);
        });
    //$("#homePageContent").fadeIn().animate({}, 20);
}


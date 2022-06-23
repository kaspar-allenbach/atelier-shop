import $ from "jquery";
import ieDetector from "./ieDetector";
import naviWaypoints from "./naviWaypoints";
import formValidation from "./formValidation";
import starField from "./starField";
import mapBox from "./mapbox";
import { initImageVariants } from "./imageVariants";
import loadingIndication from "./loadingIndication";

$(document).ready(function () {
  if ($(".newsletter").length) {
    starField();
  }

  loadingIndication();

  ieDetector();
  initImageVariants();
  naviWaypoints();
  formValidation();
  if ($("#mapBox").length) {
    mapBox();
  }

  //initializes the single preview image lightbox
  if ($(".productGallery").length) {
    $(".productGallery").lightGallery({
      download: false,
    });
  }

  $("#mobileNavOpener").click(function () {
    $(".navigationMobile").addClass("opened");
    starField();
  });
  $("#mobileNavCloser").click(function () {
    $(".navigationMobile").removeClass("opened");
  });

  //pass active class to toplevel dropdown
  $(".dropdown li.active").parents("li").addClass("active");

  //show/hide label fields
  $("form :input")
    .focus(function () {
      $("label[for='" + this.id + "']").css("opacity", "0.6 ");
    });

  if ($(".internetExplorer").length) {
    $("body").append(`
      <div class='ieUser'>
        <div class='locale'>
          <h2>You are using Internet Explorer</h2>
          <p>
            Please use a modern Browser like, 
            <a href='https://microsoft.com/edge'>Microsoft edge</a>, or
            <a href='https://www.mozilla.org/de/firefox/new/'>Firefox</a>. Thank you.
          </p>
        </div>
        <div class='locale'>
          <h2>Sie benutzen den Internet Explorer</h2>
          <p>
            Bitte benutzen Sie einen modernen Browser wie zum Beispiel, 
            <a href='https://microsoft.com/edge'>Microsoft edge</a>, oder
            <a href='https://www.mozilla.org/de/firefox/new/'>Firefox</a>. Besten dank.
          </p>
        </div>
        <small>I don't care / Mir egal: <a href='#' class='closeIeWarning'>close/schliessen message</a></small>
      </div>`);
    $(".closeIeWarning").click(function () {
      $(".ieUser").hide();
    });
  }
});

//set select to switzerland if none is selected
if ($(".js-address-country").length) {
  var countryID = $(".js-address-country option:selected").val();
  if (countryID | length) {
    $(".js-address-country").val("43");
  }
}

$(".toggleFieldButton").click(function(){
  $(this).toggleClass("fieldOpen");
  $(this).siblings(".toggleField").toggleClass("showField");
});
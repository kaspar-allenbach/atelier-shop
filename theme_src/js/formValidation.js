export default function formValidation() {
  
  // adds required tag to inputs on page load
  $("#shippingAddress-firstName").attr("required", "");
  $("#shippingAddress-lastName").attr("required", "");
  $("#shippingAddress-address1").attr("required", "");
  $("#shippingAddress-zipCode").attr("required", "");
  $("#shippingAddress-city").attr("required", "");
  $(".js-address-country").attr("required", "");

  // listens to billing address checkbox
  $("#billingAddressSameAsShipping").change(function () {
    if ($(this).is(":checked")) {
      //removes required attributes when checkbox is checked (billing address form invisible)
      $("#billingAddress-firstName").removeAttr("required");
      $("#billingAddress-lastName").removeAttr("required");
      $("#billingAddress-address1").removeAttr("required");
      $("#billingAddress-zipCode").removeAttr("required");
      $("#billingAddress-city").removeAttr("required");
      $(".js-address-country").removeAttr("required");
    } else {
      //adds required attribute when checkbox is unchecked (billing address form visible)
      $("#billingAddress-firstName").attr("required", "");
      $("#billingAddress-lastName").attr("required", "");
      $("#billingAddress-address1").attr("required", "");
      $("#billingAddress-zipCode").attr("required", "");
      $("#billingAddress-city").attr("required", "");
      $(".js-address-country").attr("required", "");
    }
  });
}

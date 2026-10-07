/* ==========================================================================
   Donation form (donation.html) — amount chips and field hygiene.
   UI only: the form still submits as a normal POST, so a backend or payment
   gateway (Razorpay etc.) reads `amount`, `campaign`, `payment_method`,
   `name`, `email`, `phone`, `message` and `updates_optin` from it.
   ========================================================================== */
(function () {
  "use strict";

  var form = document.getElementById("donation-form");
  if (!form) return;

  var amount = form.querySelector("#dn-amount");
  var custom = form.querySelector(".cvd-dn-custom");
  var chips = form.querySelectorAll('input[name="amount_choice"]');
  var phone = form.querySelector("#dn-phone");

  // A preset chip writes its value into the amount field and hides it;
  // "Custom" reveals the field for the donor to type their own amount.
  function syncAmount(fromUser) {
    var picked = form.querySelector('input[name="amount_choice"]:checked');
    var isCustom = !picked || picked.value === "custom";
    custom.hidden = !isCustom;
    if (!isCustom) {
      amount.value = picked.value;
    } else if (fromUser) {
      amount.value = "";
      amount.focus();
    }
  }
  for (var i = 0; i < chips.length; i++) {
    chips[i].addEventListener("change", function () { syncAmount(true); });
  }
  syncAmount(false);

  // Indian mobile numbers: digits only, 10 max. A pasted "+91 98765 43210"
  // keeps its last ten digits rather than being cut short.
  if (phone) {
    phone.addEventListener("input", function () {
      var digits = phone.value.replace(/\D/g, "");
      if (digits.length > 10 && digits.indexOf("91") === 0) digits = digits.slice(2);
      digits = digits.slice(0, 10);
      if (digits !== phone.value) phone.value = digits;
    });
  }

  // Show invalid styling on untouched fields once a submit has been tried.
  form.addEventListener("invalid", function () {
    form.classList.add("was-submitted");
  }, true);
})();

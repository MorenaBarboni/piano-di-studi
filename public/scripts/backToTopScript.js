if (
  window.location.href.indexOf("profile") !== -1 ||
  window.location.href.indexOf("career") !== -1
) {
  window.onscroll = function() {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById("goToTop").style.display = "block";
    } else {
      document.getElementById("goToTop").style.display = "none";
    }
  }
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}

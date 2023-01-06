function showerToggler() {
  var x = document.getElementById("heatmap_board");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  var y = document.getElementById("situation_board");
  if (y.style.display === "none") {
    y.style.display = "block";
  } else {
    y.style.display = "none";
  }
}

function resetCurrentGame() {
  currentGame = null;
  document.getElementById("game_title").innerHTML = "All games"
  refreshHeatmap();
  posShow.reset();
  loadEval("null")
}


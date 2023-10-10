function suggest(element){
    const {win,draw,lose} = JSON.parse(element.getAttribute("params"));
    console.log(win,draw,lose);
    document.getElementById("won_points").value = win;
    document.getElementById("neutral_points").value = draw;
    document.getElementById("loss_points").value = lose;
}
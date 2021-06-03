window.onload = function () {
    let box = document.getElementById('box');
    box.addEventListener('scroll', function (e: any) {
        // console.log('scroll', e);

        let innerHeight = e.target.clientHeight;
        let scrollTop = e.target.scrollTop;
        let scrollHeight = e.target.scrollHeight;
        // console.log(scrollTop, scrollHeight);
        if (scrollHeight - scrollTop === innerHeight) {
            console.log("► End of scroll");
        }
    });
    // let boxRect = box.getClientRects();

    // console.log(boxRect);
}
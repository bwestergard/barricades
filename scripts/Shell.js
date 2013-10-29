    function drawShell(x, y) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.strokeStyle="rgba(240, 30, 40, 1)";
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(x,y);
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

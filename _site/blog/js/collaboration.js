var $c = $(".c");
var w = window.innerWidth;
var h = window.innerHeight;
var hi = 300 / $c.length;
var wi = 100 / $c.length;

$c.each(function(i) {
	var _ = $(this);
	var size = random(5, 50);

	TweenMax.set(_, {
		left: i * wi + "vw",
		top: '101vh',
		z: random(-100, 100),
		width: size,
		height: size,
		opacity: 1,

	});

	TweenMax.to(_, random(2, 6), {
		physics2D: {
			velocity: random(100, 300),
			gravity: 100,
			angle: random(-80, -100)
		},
		scale: .1,
		opacity: 0,
		repeat: -1,
		delay: i * -.2,
	})
});

function random(min, max) {
	return Math.random() * (max - min) + min;
}
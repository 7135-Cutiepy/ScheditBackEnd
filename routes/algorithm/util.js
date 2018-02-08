function rand(i,exclude){
	var r = Math.floor(Math.random() * i)
	if(exclude){
		while(exclude.indexOf(r) !== -1){
			r = Math.floor(Math.random() * i)
		}
	}
	return r;
}
//x and y are both points, 0 represents the start and 1 represents the end
function overlap1D(x0,x1,y0,y1){
	return !((x0 > y0  && x1 > y0) || (y0 > x0 && y0 > x1))
}
module.exports = {
	rand:rand,
	overlap1D:overlap1D
};
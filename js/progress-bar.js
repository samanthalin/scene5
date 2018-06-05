
AFRAME.registerComponent("progress-bar",{
	init : function(){
		this.el.id = "progress-bar";
		this.updateBar = this.updateBar.bind(this);
		var barPosition = {
			x : 0.05,
			y : 0,
			z : 0
		}
		
		for(i = 0; i < 20; i++){
			var entity = document.createElement("a-plane");
			entity.setAttribute("material", {"color" : "red", "width" : "10"});
			entity.setAttribute("position", barPosition);
			entity.setAttribute("scale","0.043 0.08 0.08");
			entity.setAttribute("class","bar-scale");
			entity.setAttribute("data-index", i + 1);
			barPosition.x += 0.05;
			entity.setAttribute("visible","false");
			this.el.appendChild(entity);
		}
	},

	play : function(){
		var el = this.el;
		el.addEventListener("updateBar", this.updateBar);
	},

	pause : function(){
		var el = this.el;
		el.removeEventListener("updateBar", this.updateBar);
	},

	updateBar : function(evt){
		var percent = evt.detail.percentage;
		var barScaleNumber = Math.floor(percent / 5);
		var barScale = this.el.querySelector("a-plane[data-index='" + barScaleNumber + "']");
		barScale.setAttribute("visible",true);
	}

})








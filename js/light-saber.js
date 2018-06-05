AFRAME.registerComponent('light-saber', {
	init : function(){
		this.primaryHand = null;

    var entity = document.createElement('a-entity');
    entity.id = "saber";
    entity.setAttribute('gltf-model', '#saber-obj');
    entity.setAttribute('scale', '0.3 0.3 0.3');
    entity.setAttribute('rotation', "88 180 180");
    this.el.appendChild(entity);
    this.saber = entity;

    this.setPrimaryHand = this.setPrimaryHand.bind(this);
    this.freeHands = this.freeHands.bind(this);
   	this.turnSaberOn = this.turnSaberOn.bind(this);
   	this.turnSaberOff = this.turnSaberOff.bind(this);
   	this.changeColor = this.changeColor.bind(this);
    this.saberLine = null;
    this.colorArray = ["red","yellow","blue"];
    this.colorArrayIndex = 0;
    this.createSaber();
	},

	play: function() {
    var el = this.el;
    el.addEventListener('setPrimaryHand', this.setPrimaryHand);
    el.addEventListener('freeHands', this.freeHands);
    el.addEventListener('turnSaberOn', this.turnSaberOn);
    el.addEventListener('turnSaberOff', this.turnSaberOff);
    el.addEventListener('changeColor', this.changeColor);
  },

  pause: function() {
    var el = this.el;
    el.removeEventListener('setPrimaryHand', this.setPrimaryHand);
    el.removeEventListener('freeHands', this.freeHands);
    el.removeEventListener('turnSaberOn', this.turnSaberOn);
    el.removeEventListener('turnSaberOff', this.turnSaberOff);
    el.removeEventListener('changeColor', this.changeColor);
  },

  turnSaberOn : function(){
  	this.saberLine.setAttribute("visible","true");
  	this.saberLine.emit("turnon");
  },

  turnSaberOff : function(){
  	this.saberLine.emit("turnoff");
  	this.saberLine.setAttribute("visible","false");
  },

	setPrimaryHand: function(evt) {
    this.primaryHand = evt.detail.hand;
    this.primaryHandElement = document.getElementById(evt.detail.hand + 'Hand')
    if (this.primaryHand === 'left') {
      this.secondaryHandElement = document.getElementById('rightHand')
    }
    if (this.primaryHand === 'right') {
      this.secondaryHandElement = document.getElementById('leftHand')
    }

  },

  changeColor : function(evt){
  	if (this.primaryHand === null || this.primaryHand === evt.detail.hand) {
      return;
    }
    this.saberLine.setAttribute("color",this.colorArray[this.colorArrayIndex]);
    this.colorArrayIndex++;
    if(this.colorArrayIndex > 2){
    	this.colorArrayIndex = 0;
    }
  },

  freeHands: function(evt) {
    if (this.primaryHand === null || this.primaryHand === evt.detail.hand) {
      this.primaryHand = null;
    }
  },

  tick: function() {

  },
	
	createSaber : function(){
  	var saberLine = document.createElement("a-cylinder");
  	saberLine.id = "saberLine";
  	saberLine.setAttribute("color", this.data.lineColor);
  	saberLine.setAttribute("position","0 0 -2")
  	saberLine.setAttribute("height","0");
  	saberLine.setAttribute("radius","0.1");
  	saberLine.setAttribute("rotation","89 180 180");
  	saberLine.setAttribute("animation__turnon",{"property" : "height", "startEvents" : "turnon", "form" : "0", "to" : "4", "dur" : "200"});
  	saberLine.setAttribute("animation__turnoff",{"property" : "height", "startEvents" : "turnoff", "from" : "4", "to" : "0", "dur" : "200"});
  	saberLine.setAttribute("visible","false");
  	saberLine.setAttribute("aabb-collider","objects:.virus");
  	this.saber.append(saberLine);
    this.saberLine = saberLine;
    return;
	}
})
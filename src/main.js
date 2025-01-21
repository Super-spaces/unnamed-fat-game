/* Health Bar code - Start */
window.Health = function (CurHP, MaxHP, BarID, Horizontal, Container) {
	if (Container == undefined) {
		Container = document;
	}
	var HP = parseInt((CurHP / MaxHP) * 100).clamp(0, 100);
	var BarElement = $(Container).find("#" + BarID);
	if (Horizontal) {
		BarElement.css({ width: HP + "%" });
	} else {
		BarElement.css({ height: HP + "%" });
	}
	BarElement.attr("title", CurHP + "/" + MaxHP + " HP");
	$(Container).find("#" + BarID + "bkg").attr("title", CurHP + "/" + MaxHP + " HP");
};
/* Health Bar code - End */

/* hovertip v2.0 - Start */
window.UpdateHoverTipTxt = function (container) {
	if (Engine.isIdle()) {
		clearInterval(HTTIntervalID);
		if (container === undefined) {
			container = $(document);
		} else {
			container = $(container);
		}
		var i, id, top, left, parent, elementList, element, hoverPos, boxPos, zindex;
		elementList = container.find('span[id^="hoverTipTxt"]');
		for (i = 0; i < elementList.length; i++) {
			element = $(elementList[i]);
			id = elementList[i].id.substring(11);
			/* Find parent hoverTip item on the page. */
			parent = $(container).find("#hoverTip" + (id));
			/* Position bottom of hoverTipTxt just above the parent. */
			top = Math.round(-element.outerHeight() - 6);
			/* Center hoverTipTxt horizontally over parent. */
			left = Math.round((parent.outerWidth() - element.outerWidth()) / 2);
			/* See if the hoverTip is contained by something with a higher z-index. */
			zindex = element.css("z-index");
			if (zindex === "auto") {
				zindex = 0;
			} else {
				zindex = parseInt(zindex, 10);
			}
			while (parent.parent()[0] !== document) {
				if ((parent.parent().css("z-index") !== "auto") && (parseInt(parent.parent().css("z-index"), 10) > zindex)) {
					/* Get container rect. */
					boxPos = parent[0].getBoundingClientRect();
					break;
				}
				parent = parent.parent();
			}
			/* Update position. */
			element.css({ top: top, left: left });
			hoverPos = element[0].getBoundingClientRect();
			/* Make sure the text isn't outside the bottom of the screen. */
			if (hoverPos.top > window.innerHeight - hoverPos.height - 10) {
				top -= hoverPos.top - (window.innerHeight - hoverPos.height - 10);
			}
			/* Make sure the text isn't outside the top of the screen. */
			if (hoverPos.top < 4) {
				top -= hoverPos.top - 4;
			}
			/* Make sure the text isn't outside the right of the screen. */
			if (hoverPos.left > window.innerWidth - hoverPos.width - 26) {
				left -= hoverPos.left - (window.innerWidth - hoverPos.width - 26);
			}
			/* Make sure the text isn't outside the left of the screen. */
			if (hoverPos.left < 4) {
				left -= hoverPos.left - 4;
			}
			/* Update position. */
			element.css({ top: Math.round(top), left: Math.round(left) });
			hoverPos = element[0].getBoundingClientRect();
			if (boxPos) {  /* Fit within dialog boxes and the like. */
				/* Make sure the text isn't outside the bottom of the box. */
				if (hoverPos.top > boxPos.bottom - hoverPos.height - 10) {
					top -= hoverPos.top - (boxPos.bottom - hoverPos.height - 10);
				}
				/* Make sure the text isn't outside the top of the box. */
				if (hoverPos.top < boxPos.top + 4) {
					top -= hoverPos.top - (boxPos.top + 4);
				}
				/* Make sure the text isn't outside the right of the box. */
				if (hoverPos.left > boxPos.right - hoverPos.width - 26) {
					left -= hoverPos.left - (boxPos.right - hoverPos.width - 26);
				}
				/* Make sure the text isn't outside the left of the box. */
				if (hoverPos.left < boxPos.left + 4) {
					left -= hoverPos.left - boxPos.left - 4;
				}
				/* Update position. */
				element.css({ top: Math.round(top), left: Math.round(left) });
			}
		}
	} else {
		clearInterval(HTTIntervalID);
		HTTIntervalID = setInterval(UpdateHoverTipTxt, 300);
	}
};
/*  Waits for passage to be fully rendered before doing anything.  */
var HTTIntervalID = 0;
$(document).on(":passageend", function (ev) {
	UpdateHoverTipTxt();
});
$(window).on("resize scroll", function (ev) {
	clearInterval(HTTIntervalID);
	HTTIntervalID = setInterval(UpdateHoverTipTxt, 300);
});
$("#ui-bar-toggle").on("click", function (ev) {
	clearInterval(HTTIntervalID);
	HTTIntervalID = setInterval(UpdateHoverTipTxt, 300);
});
/* <<hovertip>> macro */
Macro.add("hovertip", {
	tags	 : null,
	handler  : function () {
		if (this.args.length > 0) {
			var mw = "";
			if ((this.args.length > 1) && (!isNaN(parseInt(this.args[1], 10)))) {
				mw = ' style="max-width: ' + parseInt(this.args[1], 10) + 'px;"';
			}
			if (State.temporary.HoverTipCount == undefined) {
				State.temporary.HoverTipCount = 1;
			} else {
				State.temporary.HoverTipCount++;
			}
			while ($("#hoverTip" + State.temporary.HoverTipCount).length) {
				/* Found an existing hoverTip. */
				State.temporary.HoverTipCount++;
			}
			var output = '<span id="hoverTip' + State.temporary.HoverTipCount +
					'" class="hoverTipTxt hoverTip" tabindex="0" ' +
					'onmouseenter="UpdateHoverTipTxt();">' +
					this.payload[0].contents + '<span id="hoverTipTxt' +
					State.temporary.HoverTipCount + '" class="hoverBox hoverTail"' +
					mw + '>' + this.args[0] + '</span></span>';
			$(this.output).wiki(output);
		} else {
			$(this.output).wiki(this.payload[0].contents);
		}
	}
});
/* hovertip v2.0 - End */
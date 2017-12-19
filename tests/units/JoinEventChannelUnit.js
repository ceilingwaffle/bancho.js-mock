const TestUnit = require("../TestUnit").TestUnit;
const TestGoals = require("../TestGoals");

class JoinEventChannelUnit extends TestUnit {
	constructor() {
		super();
		this.name = "JoinEventChannelUnit";
	}

	run() {
		return new Promise((resolve, reject) => {
			const channel = "#french";
			let returned = false;
			this.client.on("JOIN", (obj) => {
				if(obj.user.isClient() && obj.channel == channel) {
					this.fulFillGoal(TestGoals.JoinEvent);
					this.client.leaveChannel(channel);

					this.client.on("PART", (obj) => {
						if(obj.user.isClient() && obj.channel == channel) {
							this.fulFillGoal(TestGoals.PartEvent);
							returned = true;
							resolve();
						}
					});
				}
			});
			this.client.on("nochannel", (errorChannel) => {
				if(errorChannel == channel) {
					returned = true;
					reject(new Error("No such channel: "+errorChannel));
				}
			});
			this.client.joinChannel(channel);
			setTimeout(() => {
				if(!returned)
					reject(new Error("Didn't join after timeout!"));
			}, 10000);
		});
	}
}

module.exports = new JoinEventChannelUnit();
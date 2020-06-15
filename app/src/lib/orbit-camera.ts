import GameScriptType from "../core/gameScriptType";

export class OrbitCamera extends GameScriptType {
	distanceMax: number = 0;
	distanceMin: number = 0;
	pitchAngleMax: number = 90;
	pitchAngleMin: number = -90;
	// Override default of 0 (no inertia)
	inertiaFactor: number = 0.2;
	focusEntity!: pc.Entity;
	frameOnStart: boolean = true;

	private targetDistance: number = 0;
	private targetPitch: number = 0;
	private targetYaw: number = 0;
	private modelsAabb!: pc.BoundingBox;

	get distance() {
		return this.targetDistance;
	}
	set distance(value) {
		this.targetDistance = this.clampDistance(value);
	}

	get pitch() {
		return this.targetPitch;
	}
	set pitch(value) {
		this.targetPitch = this.clampPitchAngle(value);
	}

	get yaw() {
		return this.targetYaw;
	}
	set yaw(value) {
		this.targetYaw = value;

		// Ensure that the yaw takes the shortest route by making sure that
		// the difference between the targetYaw and the actual is 180 degrees
		// in either direction
		var diff = this.targetYaw - this.yaw;
		var reminder = diff % 360;
		if (reminder > 180) {
			this.targetYaw = this.yaw - (360 - reminder);
		} else if (reminder < -180) {
			this.targetYaw = this.yaw + (360 + reminder);
		} else {
			this.targetYaw = this.yaw + reminder;
		}
	}

	private _pivotPoint!: pc.Vec3;
	get pivotPoint() {
		return this._pivotPoint;
	}
	set pivotPoint(value) {
		this._pivotPoint.copy(value);
	}

	/**
	 * Moves the camera to look at an entity and all its children so they are all in the view
	 */
	focus(focusEntity) {
		// Calculate an bounding box that encompasses all the models to frame in the camera view
		this.buildAabb(focusEntity, 0);

		var halfExtents = this.modelsAabb.halfExtents;
		var radius = Math.max(halfExtents.x, Math.max(halfExtents.y, halfExtents.z));

		this.distance =
			(radius * 1.5) / Math.sin(0.5 * this.entity.camera?.fov! * pc.math.DEG_TO_RAD);

		this.removeInertia();

		this._pivotPoint.copy(this.modelsAabb.center);
	}

	resetAndLookAtPoint(resetPoint, lookAtPoint: pc.Vec3) {
		this.pivotPoint.copy(lookAtPoint);
		this.entity.setPosition(resetPoint);

		this.entity.lookAt(lookAtPoint);

		var distance = OrbitCamera.distanceBetween;
		distance.sub2(lookAtPoint, resetPoint);
		this.distance = distance.length();

		this.pivotPoint.copy(lookAtPoint);

		var cameraQuat = this.entity.getRotation();
		this.yaw = this.calcYaw(cameraQuat);
		this.pitch = this.calcPitch(cameraQuat, this.yaw);

		this.removeInertia();
		this.updatePosition();
	}

	resetAndLookAtEntity(resetPoint, entity) {
		this.buildAabb(entity, 0);
		this.resetAndLookAtPoint(resetPoint, this.modelsAabb.center);
	}

	reset(yaw, pitch, distance) {
		this.pitch = pitch;
		this.yaw = yaw;
		this.distance = distance;
		this.removeInertia();
	}

	static distanceBetween: pc.Vec3 = new pc.Vec3();

	private clampDistance(distance) {
		if (this.distanceMax > 0) {
			return pc.math.clamp(distance, this.distanceMin, this.distanceMax);
		}
		return Math.max(distance, this.distanceMin);
	}

	private clampPitchAngle(pitch) {
		// Negative due as the pitch is inversed since the camera is orbiting the entity
		return pc.math.clamp(pitch, -this.pitchAngleMax, -this.pitchAngleMin);
	}

	private buildAabb(entity, modelsAdded) {
		var i = 0;

		if (entity.model) {
			var mi = entity.model.meshInstances;
			for (i = 0; i < mi.length; i++) {
				if (modelsAdded === 0) {
					this.modelsAabb.copy(mi[i].aabb);
				} else {
					this.modelsAabb.add(mi[i].aabb);
				}

				modelsAdded += 1;
			}
		}

		for (i = 0; i < entity.children.length; ++i) {
			modelsAdded += this.buildAabb(entity.children[i], modelsAdded);
		}

		return modelsAdded;
	}

	private calcYaw(quat) {
		var transformedForward = new pc.Vec3();
		quat.transformVector(pc.Vec3.FORWARD, transformedForward);

		return Math.atan2(-transformedForward.x, -transformedForward.z) * pc.math.RAD_TO_DEG;
	}

	private removeInertia() {
		this.yaw = this.targetYaw;
		this.pitch = this.targetPitch;
		this.distance = this.targetDistance;
	}

	private checkAspectRatio() {
		var height = this.app.graphicsDevice.height;
		var width = this.app.graphicsDevice.width;

		// Match the axis of FOV to match the aspect ratio of the canvas so
		// the focused entities is always in frame
		Object.assign(this.entity?.camera!, { horizontalFov: height > width });
		// this.entity.camera?.horizontalFov == height > width;
	}

	static quatWithoutYaw = new pc.Quat();
	static yawOffset = new pc.Quat();

	private calcPitch(quat, yaw) {
		var quatWithoutYaw = OrbitCamera.quatWithoutYaw;
		var yawOffset = OrbitCamera.yawOffset;

		yawOffset.setFromEulerAngles(0, -yaw, 0);
		quatWithoutYaw.mul2(yawOffset, quat);

		var transformedForward = new pc.Vec3();

		quatWithoutYaw.transformVector(pc.Vec3.FORWARD, transformedForward);

		return Math.atan2(transformedForward.y, -transformedForward.z) * pc.math.RAD_TO_DEG;
	}

	initialize() {
		var self = this;
		var onWindowResize = function () {
			self.checkAspectRatio();
		};

		window.addEventListener("resize", onWindowResize, false);

		this.checkAspectRatio();

		// Find all the models in the scene that are under the focused entity
		this.modelsAabb = new pc.BoundingBox();
		this.buildAabb(this.focusEntity || this.app.root, 0);

		this.entity.lookAt(this.modelsAabb.center);

		this._pivotPoint = new pc.Vec3();
		this._pivotPoint.copy(this.modelsAabb.center);

		// Calculate the camera euler angle rotation around x and y axes
		// This allows us to place the camera at a particular rotation to begin with in the scene
		var cameraQuat = this.entity.getRotation();

		// Preset the camera
		this.yaw = this.calcYaw(cameraQuat);
		this.pitch = this.clampPitchAngle(this.calcPitch(cameraQuat, this.yaw));
		this.entity.setLocalEulerAngles(this.pitch, this.yaw, 0);

		this.distance = 0;

		this.targetYaw = this.yaw;
		this.targetPitch = this.pitch;

		// If we have ticked focus on start, then attempt to position the camera where it frames
		// the focused entity and move the pivot point to entity's position otherwise, set the distance
		// to be between the camera position in the scene and the pivot point
		if (this.frameOnStart) {
			this.focus(this.focusEntity || this.app.root);
		} else {
			var distanceBetween = new pc.Vec3();
			distanceBetween.sub2(this.entity.getPosition(), this._pivotPoint);
			this.distance = this.clampDistance(distanceBetween.length());
		}

		this.targetDistance = this.distance;

		// Reapply the clamps if they are changed in the editor
		this.on("attr:distanceMin", (value, prev) => {
			this.distance = this.clampDistance(this.distance);
		});

		this.on("attr:distanceMax", (value, prev) => {
			this.distance = this.clampDistance(this.distance);
		});

		this.on("attr:pitchAngleMin", (value, prev) => {
			this.pitch = this.clampPitchAngle(this.pitch);
		});

		this.on("attr:pitchAngleMax", (value, prev) => {
			this.pitch = this.clampPitchAngle(this.pitch);
		});

		// Focus on the entity if we change the focus entity
		this.on("attr:focusEntity", (value, prev) => {
			if (this.frameOnStart) {
				this.focus(value || this.app.root);
			} else {
				this.resetAndLookAtEntity(this.entity.getPosition(), value || this.app.root);
			}
		});

		this.on("attr:frameOnStart", (value, prev) => {
			if (value) {
				this.focus(this.focusEntity || this.app.root);
			}
		});

		this.on("destroy", function () {
			window.removeEventListener("resize", onWindowResize, false);
		});
	}

	update(dt) {
		// Add inertia, if any
		var t = this.inertiaFactor === 0 ? 1 : Math.min(dt / this.inertiaFactor, 1);
		this.distance = pc.math.lerp(this.distance, this.targetDistance, t);
		this.yaw = pc.math.lerp(this.yaw, this.targetYaw, t);
		this.pitch = pc.math.lerp(this.pitch, this.targetPitch, t);

		this.updatePosition();
	}

	private updatePosition() {
		// Work out the camera position based on the pivot point, pitch, yaw and distance
		this.entity.setLocalPosition(0, 0, 0);
		this.entity.setLocalEulerAngles(this.pitch, this.yaw, 0);

		var position = this.entity.getPosition();
		position.copy(this.entity.forward);
		position.scale(-this.distance);
		position.add(this.pivotPoint);
		this.entity.setPosition(position);
	}
}

/**
 * Orbit Camera Mouse Input Script
 */
export class OrbitCameraInputMouse extends GameScriptType {
	orbitSensitivity: number = 0.3;
	distanceSensitivity: number = 0.15;

	static fromWorldPoint: pc.Vec3 = new pc.Vec3();
	static toWorldPoint: pc.Vec3 = new pc.Vec3();
	static worldDiff: pc.Vec3 = new pc.Vec3();

	orbitCamera!: OrbitCamera;
	lookButtonDown: boolean = false;
	panButtonDown: boolean = false;
	lastPoint!: pc.Vec2;

	initialize() {
		this.orbitCamera = this.entity.script?.get(OrbitCamera)! as OrbitCamera;
		if (this.orbitCamera) {
			var onMouseOut = (e) => {
				this.onMouseOut(e);
			};

			this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
			this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
			this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
			this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

			// Listen to when the mouse travels out of the window
			window.addEventListener("mouseout", onMouseOut, false);

			// Remove the listeners so if this entity is destroyed
			this.on("destroy", () => {
				this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
				this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
				this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
				this.app.mouse.off(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this);

				window.removeEventListener("mouseout", onMouseOut, false);
			});
		}

		// Disabling the context menu stops the browser displaying a menu when
		// you right-click the page
		this.app.mouse.disableContextMenu();

		this.lookButtonDown = false;
		this.panButtonDown = false;
		this.lastPoint = new pc.Vec2();
	}

	pan(screenPoint) {
		var fromWorldPoint = OrbitCameraInputMouse.fromWorldPoint;
		var toWorldPoint = OrbitCameraInputMouse.toWorldPoint;
		var worldDiff = OrbitCameraInputMouse.worldDiff;

		// For panning to work at any zoom level, we use screen point to world projection
		// to work out how far we need to pan the pivotEntity in world space
		var camera = this.entity.camera!;
		var distance = this.orbitCamera.distance;

		camera.screenToWorld(screenPoint.x, screenPoint.y, distance, fromWorldPoint);
		camera.screenToWorld(this.lastPoint.x, this.lastPoint.y, distance, toWorldPoint);

		worldDiff.sub2(toWorldPoint, fromWorldPoint);

		this.orbitCamera.pivotPoint.add(worldDiff);
	}

	onMouseDown(event) {
		switch (event.button) {
			case pc.MOUSEBUTTON_LEFT:
				this.lookButtonDown = true;
				break;
			case pc.MOUSEBUTTON_MIDDLE:
			case pc.MOUSEBUTTON_RIGHT:
				this.panButtonDown = true;
				break;
		}
	}

	onMouseUp(event) {
		switch (event.button) {
			case pc.MOUSEBUTTON_LEFT:
				this.lookButtonDown = false;
				break;
			case pc.MOUSEBUTTON_MIDDLE:
			case pc.MOUSEBUTTON_RIGHT:
				this.panButtonDown = false;
				break;
		}
	}

	onMouseMove(event) {
		if (this.lookButtonDown) {
			this.orbitCamera.pitch -= event.dy * this.orbitSensitivity;
			this.orbitCamera.yaw -= event.dx * this.orbitSensitivity;
		} else if (this.panButtonDown) {
			this.pan(event);
		}

		this.lastPoint.set(event.x, event.y);
	}

	onMouseWheel(event) {
		this.orbitCamera.distance -=
			event.wheel * this.distanceSensitivity * (this.orbitCamera.distance * 0.1);
		event.event.preventDefault();
	}

	onMouseOut(event) {
		this.lookButtonDown = false;
		this.panButtonDown = false;
	}
}

/**
 * Orbit Camera Touch Input Script
 */

export class OrbitCameraInputTouch extends GameScriptType {
	orbitSensitivity: number = 0.4;
	distanceSensitivity: number = 0.2;
	lastTouchPoint!: pc.Vec2;
	lastPinchMidPoint!: pc.Vec2;
	lastPinchDistance: number = 0;

	orbitCamera!: OrbitCamera;

	initialize() {
		this.orbitCamera = this.entity.script?.get(OrbitCamera) as OrbitCamera;

		// Store the position of the touch so we can calculate the distance moved
		this.lastTouchPoint = new pc.Vec2();
		this.lastPinchMidPoint = new pc.Vec2();
		this.lastPinchDistance = 0;

		if (this.orbitCamera && this.app.touch) {
			// Use the same callback for the touchStart, touchEnd and touchCancel events as they
			// all do the same thing which is to deal the possible multiple touches to the screen
			this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this);
			this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this);
			this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this);

			this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);

			this.on("destroy", () => {
				this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this);
				this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this);
				this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this);

				this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
			});
		}
	}

	getPinchDistance(pointA, pointB) {
		// Return the distance between the two points
		var dx = pointA.x - pointB.x;
		var dy = pointA.y - pointB.y;

		return Math.sqrt(dx * dx + dy * dy);
	}

	calcMidPoint(pointA, pointB, result) {
		result.set(pointB.x - pointA.x, pointB.y - pointA.y);
		result.scale(0.5);
		result.x += pointA.x;
		result.y += pointA.y;
	}

	onTouchStartEndCancel(event) {
		// We only care about the first touch for camera rotation. As the user touches the screen,
		// we stored the current touch position
		var touches = event.touches;
		if (touches.length == 1) {
			this.lastTouchPoint.set(touches[0].x, touches[0].y);
		} else if (touches.length == 2) {
			// If there are 2 touches on the screen, then set the pinch distance
			this.lastPinchDistance = this.getPinchDistance(touches[0], touches[1]);
			this.calcMidPoint(touches[0], touches[1], this.lastPinchMidPoint);
		}
	}

	static fromWorldPoint: pc.Vec3 = new pc.Vec3();
	static toWorldPoint: pc.Vec3 = new pc.Vec3();
	static worldDiff: pc.Vec3 = new pc.Vec3();

	pan(midPoint) {
		var fromWorldPoint = OrbitCameraInputTouch.fromWorldPoint;
		var toWorldPoint = OrbitCameraInputTouch.toWorldPoint;
		var worldDiff = OrbitCameraInputTouch.worldDiff;

		// For panning to work at any zoom level, we use screen point to world projection
		// to work out how far we need to pan the pivotEntity in world space
		var camera = this.entity.camera!;
		var distance = this.orbitCamera.distance;

		camera.screenToWorld(midPoint.x, midPoint.y, distance, fromWorldPoint);
		camera.screenToWorld(
			this.lastPinchMidPoint.x,
			this.lastPinchMidPoint.y,
			distance,
			toWorldPoint
		);

		worldDiff.sub2(toWorldPoint, fromWorldPoint);

		this.orbitCamera.pivotPoint.add(worldDiff);
	}

	static pinchMidPoint: pc.Vec2 = new pc.Vec2();

	onTouchMove(event) {
		var pinchMidPoint = OrbitCameraInputTouch.pinchMidPoint;

		// We only care about the first touch for camera rotation. Work out the difference moved since the last event
		// and use that to update the camera target position
		var touches = event.touches;
		if (touches.length == 1) {
			var touch = touches[0];

			this.orbitCamera.pitch -= (touch.y - this.lastTouchPoint.y) * this.orbitSensitivity;
			this.orbitCamera.yaw -= (touch.x - this.lastTouchPoint.x) * this.orbitSensitivity;

			this.lastTouchPoint.set(touch.x, touch.y);
		} else if (touches.length == 2) {
			// Calculate the difference in pinch distance since the last event
			var currentPinchDistance = this.getPinchDistance(touches[0], touches[1]);
			var diffInPinchDistance = currentPinchDistance - this.lastPinchDistance;
			this.lastPinchDistance = currentPinchDistance;

			this.orbitCamera.distance -=
				diffInPinchDistance *
				this.distanceSensitivity *
				0.1 *
				(this.orbitCamera.distance * 0.1);

			// Calculate pan difference
			this.calcMidPoint(touches[0], touches[1], pinchMidPoint);
			this.pan(pinchMidPoint);
			this.lastPinchMidPoint.copy(pinchMidPoint);
		}
	}
}

import {z} from 'zod';

const animationSettingsSchema = z.object({
	duration: z.optional(z.number()),
	type: z.optional(z.string()),
	movePx: z.optional(z.number()),
	rotatePx: z.optional(z.number()),
	stroke: z.optional(z.string()),
	strokeWidth: z.optional(z.number()),
	scaleX: z.optional(z.number()),
	scaleY: z.optional(z.number()),
	sceneDuration: z.optional(z.number()),
	loop: z.optional(z.boolean()),
	velocity: z.optional(z.union([z.number(), z.null()])),
	ease: z.optional(z.string()),
	stepDuration: z.optional(z.number()),
	startNoise: z.optional(z.number()),
	jumpNoise: z.optional(z.number()),
	intensity: z.optional(z.number()),
});

const baseLayerSchema = z.object({
	id: z.optional(z.string()),
	start: z.optional(z.number()),
	stop: z.optional(z.number()),
	animation: z.optional(z.boolean()),
	animationSettings: z.optional(
		z.union([animationSettingsSchema, z.array(animationSettingsSchema)])
	),
});

const backgroundLayerSchema = z.object({
	zoomDirection: z.optional(z.enum(['in', 'out'])),
	resizeMode: z.optional(
		z.enum(['contain', 'contain-blur', 'cover', 'stretch'])
	),
});

const backgroundVideoLayerSchema = z
	.object({
		path: z.string(),
		cutTo: z.optional(z.number()),
		mixVolume: z.optional(z.number()),
	})
	.merge(baseLayerSchema)
	.merge(backgroundLayerSchema);

const woxoVideoSchema = z
	.object({type: z.literal('woxo-video')})
	.merge(backgroundVideoLayerSchema);

const backgroundImageLayerSchema = z
	.object({
		path: z.string(),
	})
	.merge(baseLayerSchema)
	.merge(backgroundLayerSchema);

const woxoImageSchema = z
	.object({type: z.literal('woxo-image')})
	.merge(backgroundImageLayerSchema);

const backgroundColorLayerSchema = z
	.object({
		color: z.string(),
		width: z.optional(z.number()),
		height: z.optional(z.number()),
	})
	.merge(baseLayerSchema)
	.merge(backgroundLayerSchema);

const woxoFillColorSchema = z
	.object({type: z.literal('woxo-fill-color')})
	.merge(backgroundColorLayerSchema);

const baseCompoundLayerSchema = z.object({
	compoundType: z.enum(['circle', 'rect', 'polygon', 'ellipse', 'triangle']),
	polygonType: z.optional(
		z.enum(['triangle', 'eq-triangle', 'star', 'regular', 'binoculars'])
	),
	color: z.optional(z.string()),
	width: z.optional(z.number()),
	height: z.optional(z.number()),
	globalComposite: z.optional(
		z.enum([
			'source-over',
			'source-in',
			'source-out',
			'source-atop',
			'destination-over',
			'destination-atop',
			'destination-out',
			'destination-in',
			'lighter',
			'copy',
			'xor',
			'multiply',
			'screen',
			'overlay',
			'darken',
			'lighten',
			'color-dodge',
			'color-burn',
			'hard-light',
			'soft-light',
			'difference',
			'exclusion',
			'hue',
			'saturation',
			'color',
			'luminosity',
		])
	),
	spikeCount: z.optional(z.number()),
	outerRadius: z.optional(z.number()),
	sideCount: z.optional(z.number()),
	innerRadius: z.optional(z.number()),
	sideLength: z.optional(z.number()),
	borderRadiusX: z.optional(z.number()),
	borderRadiusY: z.optional(z.number()),
});

const compoundLayerSchema = baseCompoundLayerSchema
	.merge(baseLayerSchema)
	.merge(backgroundLayerSchema);

const woxoCompoundSchema = z
	.object({type: z.literal('woxo-compound')})
	.merge(compoundLayerSchema);

const textOptionsSchema = z.object({
	fill: z.optional(z.string()),
	type: z.optional(z.string()),
	originX: z.optional(z.string()),
	originY: z.optional(z.string()),
	width: z.optional(z.number()),
	height: z.optional(z.number()),
	scaleX: z.optional(z.number()),
	scaleY: z.optional(z.number()),
	flipX: z.optional(z.boolean()),
	flipY: z.optional(z.boolean()),
	opacity: z.optional(z.number()),
	angle: z.optional(z.number()),
	skewX: z.optional(z.number()),
	skewY: z.optional(z.number()),
	cornerSize: z.optional(z.number()),
	transparentCorners: z.optional(z.boolean()),
	hoverCursor: z.optional(z.string()),
	moveCursor: z.optional(z.string()),
	padding: z.optional(z.number()),
	borderColor: z.optional(z.string()),
	borderDashArray: z.optional(z.array(z.number())),
	cornerColor: z.optional(z.string()),
	cornerStrokeColor: z.optional(z.string()),
	cornerStyle: z.optional(z.enum(['rect', 'circle'])),
	cornerDashArray: z.optional(z.array(z.number())),
	centeredScaling: z.optional(z.boolean()),
	centeredRotation: z.optional(z.boolean()),
	fillRule: z.optional(z.string()),
	globalCompositeOperation: z.optional(z.string()),
	backgroundColor: z.optional(
		z.union([
			z.string(),
			z.object({
				_rgb: z.array(z.number()),
			}),
		])
	),
	selectionBackgroundColor: z.optional(z.string()),
	stroke: z.optional(z.union([z.string(), z.null()])),
	strokeWidth: z.optional(z.union([z.number(), z.null()])),
	strokeDashArray: z.optional(z.array(z.number())),
	strokeDashOffset: z.optional(z.number()),
	strokeLineCap: z.optional(z.string()),
	strokeLineJoin: z.optional(z.string()),
	strokeMiterLimit: z.optional(z.number()),
	shadow: z.optional(
		z.union([
			z.object({
				color: z.optional(z.string()),
				blur: z.optional(z.number()),
				offsetX: z.optional(z.number()),
				offsetY: z.optional(z.number()),
				affectStroke: z.optional(z.boolean()),
				includeDefaultValues: z.optional(z.boolean()),
				nonScaling: z.optional(z.boolean()),
			}),
			z.string(),
			z.null(),
		])
	),
	borderOpacityWhenMoving: z.optional(z.number()),
	borderScaleFactor: z.optional(z.number()),
	minScaleLimit: z.optional(z.number()),
	selectable: z.optional(z.boolean()),
	evented: z.optional(z.boolean()),
	visible: z.optional(z.boolean()),
	hasControls: z.optional(z.boolean()),
	hasBorders: z.optional(z.boolean()),
	hasRotatingPoint: z.optional(z.boolean()),
	rotatingPointOffset: z.optional(z.number()),
	perPixelTargetFind: z.optional(z.boolean()),
	includeDefaultValues: z.optional(z.boolean()),
	lockMovementX: z.optional(z.boolean()),
	lockMovementY: z.optional(z.boolean()),
	lockRotation: z.optional(z.boolean()),
	lockScalingX: z.optional(z.boolean()),
	lockScalingY: z.optional(z.boolean()),
	lockUniScaling: z.optional(z.boolean()),
	lockSkewingX: z.optional(z.boolean()),
	lockSkewingY: z.optional(z.boolean()),
	lockScalingFlip: z.optional(z.boolean()),
	excludeFromExport: z.optional(z.boolean()),
	objectCaching: z.optional(z.boolean()),
	statefullCache: z.optional(z.boolean()),
	noScaleCache: z.optional(z.boolean()),
	strokeUniform: z.optional(z.boolean()),
	dirty: z.optional(z.boolean()),
	paintFirst: z.optional(z.string()),
	stateProperties: z.optional(z.array(z.string())),
	cacheProperties: z.optional(z.array(z.string())),
	inverted: z.optional(z.boolean()),
	absolutePositioned: z.optional(z.boolean()),
	name: z.optional(z.string()),
	snapAngle: z.optional(z.number()),
	snapThreshold: z.optional(z.union([z.number(), z.null()])),
	fontSize: z.optional(z.union([z.number(), z.string()])),
	fontWeight: z.optional(z.union([z.string(), z.number()])),
	fontFamily: z.optional(z.string()),
	underline: z.optional(z.boolean()),
	overline: z.optional(z.boolean()),
	linethrough: z.optional(z.boolean()),
	textAlign: z.optional(z.string()),
	fontStyle: z.optional(z.enum(['', 'normal', 'italic', 'oblique'])),
	lineHeight: z.optional(z.number()),
	superscript: z.optional(z.object({size: z.number(), baseline: z.number()})),
	subscript: z.optional(z.object({size: z.number(), baseline: z.number()})),
	textBackgroundColor: z.optional(z.string()),
	charSpacing: z.optional(z.number()),
	deltaY: z.optional(z.number()),
	direction: z.optional(z.enum(['ltr', 'rtl'])),
	text: z.optional(z.string()),
});

const textLayerSchema = z
	.object({
		text: z.string(),
		infoFill: z.optional(z.string()),
		infoBackgroundColor: z.optional(z.string()),
		width: z.optional(z.number()),
		height: z.optional(z.number()),
		index: z.optional(z.number()),
		top: z.enum(['top', 'center', 'bottom']),
		left: z.optional(z.enum(['left', 'center', 'right'])),
	})
	.merge(textOptionsSchema)
	.merge(baseLayerSchema);

const styledTextLayerSchema = z
	.object({
		type: z.enum([
			'woxo-custom-text-basic',
			'woxo-custom-text-criss-cross',
			'woxo-custom-text-dream-meme',
			'woxo-custom-text-solid',
			'woxo-custom-text-step-up',
			'woxo-custom-text-trade-mark',
			'woxo-text',
		]),
	})
	.merge(textLayerSchema);

const imageLayerSchema = z
	.object({
		path: z.string(),
		top: z.enum(['top', 'center', 'bottom']),
		left: z.enum(['left', 'center', 'right']),
	})
	.merge(baseLayerSchema);

const woxoImageLayerSchema = z
	.object({type: z.literal('woxo-image')})
	.merge(imageLayerSchema);

const SVGLayerSchema = z
	.object({
		path: z.string(),
		top: z.enum(['top', 'center', 'bottom']),
		left: z.enum(['left', 'center', 'right']),
	})
	.merge(baseLayerSchema);

const woxoSVGSchema = z
	.object({type: z.literal('woxo-svg')})
	.merge(SVGLayerSchema);

const woxoGradientSchema = z.object({type: z.literal('woxo-gradient')});

const serverSchema = z.object({type: z.literal('server')});

const woxoWaterMarkSchema = z.object({type: z.literal('woxo-water-mark')});

const imageSchema = z.object({type: z.literal('image'), path: z.string()});

const woxoIText = z.object({type: z.literal('woxo-itext'), text: z.string()});

const woxoSolid = z.object({type: z.literal('woxo-solid'), text: z.string()});

const woxoCrissCross = z.object({
	type: z.literal('woxo-crissCross'),
	text: z.string(),
});

const layerSchema = z.union([
	woxoVideoSchema,
	woxoImageSchema,
	woxoFillColorSchema,
	woxoCompoundSchema,
	styledTextLayerSchema,
	woxoImageLayerSchema,
	woxoSVGSchema,
	woxoGradientSchema,
	serverSchema,
	woxoWaterMarkSchema,
	imageSchema,
	woxoIText,
	woxoSolid,
	woxoCrissCross,
]);

const IAudioSchema = z.object({
	id: z.optional(z.string()),
	_customEditionId: z.optional(z.string()),
	path: z.optional(z.string()),
	mixVolume: z.optional(z.number()),
	duration: z.optional(z.number()),
	start: z.optional(z.number()),
	end: z.optional(z.number()),
	audioStartAt: z.optional(z.number()),
	selected: z.optional(z.boolean()),
	color: z.optional(z.string()),
	initNeedlePosition: z.optional(z.number()),
	loop: z.optional(z.boolean()),
});

const fontSchema = z.object({
	fontFamily: z.string(),
	path: z.string(),
});

const transitionSchema = z.object({
	duration: z.number(),
	name: z.string(),
	easing: z.optional(z.null()),
});

const clipSchema = z.object({
	duration: z.number(),
	layers: z.array(layerSchema),
	id: z.optional(z.string()),
	transition: z.optional(transitionSchema),
	keepSourceAudio: z.optional(z.boolean()),
	clipIndex: z.optional(z.number()),
});

export const videoSchema = z.object({
	id: z.string(),
	width: z.number(),
	height: z.number(),
	clips: z.array(clipSchema),
	proportion: z.optional(z.number()),
	customFonts: z.optional(z.array(fontSchema)),
	audioTracks: z.optional(z.array(IAudioSchema)),
	clipsAudioVolume: z.optional(z.number()),
	keepSourceAudio: z.optional(z.boolean()),
  meta: z.optional(z.record(z.string())),
});

export type VideoSchema = typeof videoSchema._type;

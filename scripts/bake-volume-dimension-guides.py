import math
from pathlib import Path

import bpy


WIDTH = 1080
HEIGHT = 608
ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "booking-volume-assets"
GUIDE_OVERLAY = ASSET_DIR / "dimension-guides-overlay.png"

GUIDE_LINES = [
    {
        "label": "10 ft",
        "angle": -37,
        "label_at": (430, 108),
        "line": ((329, 219), (560, 48)),
        "ticks": [((317, 203), (341, 235)), ((548, 32), (572, 64))],
    },
    {
        "label": "8 ft",
        "angle": 17,
        "label_at": (734, 42),
        "line": ((628, 45), (822, 104)),
        "ticks": [((634, 25), (622, 65)), ((828, 84), (816, 124))],
    },
    {
        "label": "5 ft",
        "angle": 0,
        "label_at": (925, 190),
        "line": ((872, 116), (872, 262)),
        "ticks": [((854, 116), (890, 116)), ((854, 262), (890, 262))],
    },
]


def px_to_world(point, z=0.0):
    x, y = point
    return (x - WIDTH / 2, HEIGHT / 2 - y, z)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    for collection in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.images):
        for item in list(collection):
            if item.users == 0:
                collection.remove(item)


def make_material(name, color):
    material = bpy.data.materials.new(name)
    material.diffuse_color = color
    return material


def add_line(name, start, end, material, width, z):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 1
    curve.bevel_depth = width / 2
    curve.bevel_resolution = 3
    curve.use_fill_caps = True
    spline = curve.splines.new("POLY")
    spline.points.add(1)
    spline.points[0].co = (*px_to_world(start, z), 1)
    spline.points[1].co = (*px_to_world(end, z), 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj


def add_text(name, label, point, angle, size, material, z):
    bpy.ops.object.text_add(location=px_to_world(point, z), rotation=(0, 0, math.radians(-angle)))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = label
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.space_character = 1
    obj.data.materials.append(material)
    return obj


def render_guide_overlay():
    clear_scene()
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = WIDTH
    scene.render.resolution_y = HEIGHT
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0
    scene.view_settings.gamma = 1

    camera_data = bpy.data.cameras.new("DimensionBakeCamera")
    camera = bpy.data.objects.new("DimensionBakeCamera", camera_data)
    bpy.context.collection.objects.link(camera)
    camera.location = (0, 0, 1000)
    camera.rotation_euler = (0, 0, 0)
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = WIDTH
    scene.camera = camera

    dark = make_material("Guide dark ink", (0.10, 0.13, 0.18, 0.58))
    label_dark = make_material("Guide label ink", (0.06, 0.09, 0.16, 0.94))
    halo = make_material("Guide white halo", (1, 1, 1, 0.68))

    for guide in GUIDE_LINES:
        start, end = guide["line"]
        add_line(f"{guide['label']} halo", start, end, halo, 4.2, 0.1)
        add_line(f"{guide['label']} rule", start, end, dark, 1.6, 0.2)
        for index, tick in enumerate(guide["ticks"]):
            tick_start, tick_end = tick
            add_line(f"{guide['label']} tick halo {index}", tick_start, tick_end, halo, 4.0, 0.1)
            add_line(f"{guide['label']} tick {index}", tick_start, tick_end, dark, 1.55, 0.2)
        add_text(f"{guide['label']} text", guide["label"], guide["label_at"], guide["angle"], 48, label_dark, 0.3)

    scene.render.filepath = str(GUIDE_OVERLAY)
    bpy.ops.render.render(write_still=True)


def main():
    render_guide_overlay()
    print("Baked transparent dimension-guide overlay:")
    print(GUIDE_OVERLAY)


if __name__ == "__main__":
    main()

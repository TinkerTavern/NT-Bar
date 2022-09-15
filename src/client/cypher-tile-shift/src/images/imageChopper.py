import os

from PIL import Image


def createSplits(image_path):
    split(image_path, 4, 4, False)
    split(image_path, 3, 3, False)


def split(image_path, rows, cols, should_cleanup):
    im = Image.open(image_path)
    im_width, im_height = im.size
    row_width = int(im_width / rows)
    row_height = int(im_height / cols)
    n = 0
    name, ext = os.path.splitext(image_path)
    newDir = name + str(rows) + "x" + str(cols) + "/"
    os.mkdir(newDir)
    for i in range(0, rows):
        for j in range(0, cols):
            box = (j * row_width, i * row_height, j * row_width +
                   row_width, i * row_height + row_height)
            outp = im.crop(box)
            outp_path = newDir + name + "_" + str(chr(ord('a') + n)) + ext
            print("Exporting image tile: " + outp_path)
            outp.save(outp_path)
            n += 1
    if should_cleanup:
        print("Cleaning up: " + image_path)
        os.remove(image_path)


if __name__ == '__main__':
    createSplits("cave.jpg")
    createSplits("rocket.jpg")
    createSplits("planet.jpg")
    createSplits("office.jpg")
    createSplits("space.jpg")

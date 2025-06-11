import rasterio
import matplotlib.pyplot as plt
import numpy as np
import os

dem_path = "data/synthetic_dem.tif"

if not os.path.exists(dem_path):
    raise FileNotFoundError(f"{dem_path} not found. Run the curl command first!")

with rasterio.open(dem_path) as src:
    elevation = src.read(1)
    profile = src.profile

print("CRS:", profile['crs'])
print("Size (rows, cols):", elevation.shape)
print("Elevation min / max:", np.nanmin(elevation), "/", np.nanmax(elevation))

plt.figure(figsize=(6, 5))
plt.imshow(elevation, cmap="terrain")
plt.colorbar(label="Elevation (m)")
plt.title("Mapbox DEM Sample")
plt.tight_layout()
plt.show()


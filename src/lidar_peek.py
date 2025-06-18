import numpy as np
import rasterio
import matplotlib.pyplot as plt

# Load the synthetic DEM
with rasterio.open("data/synthetic_dem.tif") as src:
    elevation = src.read(1)
    crs = src.crs
    print(f"CRS: {crs}")
    print(f"Size (rows, cols): {elevation.shape}")
    print(f"Elevation min / max: {elevation.min()} / {elevation.max()}")

# Create a simple anomaly mask
threshold = 200
mask = elevation > threshold

# Plot side-by-side view of DEM and anomaly mask
fig, axs = plt.subplots(1, 2, figsize=(10, 5))

axs[0].imshow(elevation, cmap="terrain")
axs[0].set_title("Synthetic DEM (Elevation)")
axs[0].axis("off")

axs[1].imshow(mask, cmap="Reds")
axs[1].set_title(f"Anomaly Mask (> {threshold} m)")
axs[1].axis("off")

plt.tight_layout()
plt.savefig("data/dem_visuals.png", dpi=150)
plt.show()

print("✓ Saved side-by-side visual to data/dem_visuals.png")

# lidar_slider.py – interactive elevation anomaly explorer

import numpy as np
import rasterio
import plotly.express as px
import plotly.graph_objects as go
import os

# --- Load the DEM data ---
dem_path = "data/dem.tif"
with rasterio.open(dem_path) as src:
    elevation = src.read(1)
    profile = src.profile

# Replace no-data values with nan for cleaner handling
elevation = np.where(elevation == profile['nodata'], np.nan, elevation)

# --- Define interactive Plotly app ---
def create_figure(threshold=200):
    mask = elevation > threshold

    # 1. Base DEM
    fig_dem = px.imshow(elevation, color_continuous_scale="Viridis", title="Base Elevation DEM")

    # 2. Binary mask
    fig_mask = px.imshow(mask.astype(int), color_continuous_scale=["black", "red"], title=f"Mask > {threshold}m")

    # 3. Overlay (mask on top of DEM)
    overlay = np.where(mask, elevation, np.nan)
    fig_overlay = px.imshow(overlay, color_continuous_scale="Reds", title="Anomalies on DEM")

    # --- Create subplot layout ---
    fig = go.Figure()

    fig.add_trace(go.Image(z=elevation), row=1, col=1)
    fig.add_trace(go.Image(z=mask.astype(int)), row=1, col=2)
    fig.add_trace(go.Image(z=overlay), row=2, col=1)

    # Add slider to update threshold
    steps = []
    for t in range(100, 300, 10):
        step = dict(
            method="update",
            args=[{"z": [elevation, (elevation > t).astype(int), np.where(elevation > t, elevation, np.nan)]}],
            label=f"{t}m"
        )
        steps.append(step)

    sliders = [dict(
        active=10,
        currentvalue={"prefix": "Threshold: "},
        pad={"t": 50},
        steps=steps
    )]

    fig.update_layout(
        title="Interactive Elevation Mask Explorer",
        sliders=sliders,
        width=1000,
        height=800
    )

    fig.show()

# --- Run ---
if __name__ == "__main__":
    create_figure(threshold=200)

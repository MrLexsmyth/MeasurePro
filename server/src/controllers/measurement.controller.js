import Measurement from "../models/Measurement.js";

/**
 * Create measurement
 */
export const createMeasurement = async (req, res) => {
  try {
    const { clientId, type, measurements, note } = req.body;

    if (!clientId) {
      return res.status(400).json({
        message: "clientId is required",
      });
    }

    const measurement = await Measurement.create({
      client: clientId,
      type,
      measurements,
      note,
    });

    res.status(201).json(measurement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * Get measurements for a client
 */
export const getClientMeasurements = async (req, res) => {
  const { clientId } = req.params;

  const measurements = await Measurement.find({ client: clientId })
    .sort({ createdAt: -1 });

  res.json(measurements);
};


export const updateMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, measurements, note } = req.body;

    const updated = await Measurement.findByIdAndUpdate(
      id,
      { type, measurements, note },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Measurement not found" });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update measurement" });
  }
};

/**
 * Delete measurement
 */
export const deleteMeasurement = async (req, res) => {
  await Measurement.findByIdAndDelete(req.params.id);
  res.json({ message: "Measurement deleted" });
};

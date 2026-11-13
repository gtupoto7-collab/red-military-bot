#ifndef CALCULATOR_H
#define CALCULATOR_H

typedef struct {
    double area;
    int has_solar;
    double wind_load;
    double snow_load;
} RoofInput;

typedef struct {
    double wood_beams_m3;
    double membrane_rolls;
    double fasteners_kg;
    double estimated_cost_bgn;
    int structural_risk;
} RoofOutput;

RoofOutput compute_roof_specs(RoofInput input);

#endif

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "calculator.h"

RoofOutput compute_roof_specs(RoofInput input) {
    RoofOutput out;

    out.wood_beams_m3 = input.area * 0.035;
    out.membrane_rolls = (input.area / 15.0) * 1.1;
    out.fasteners_kg = input.area * 0.45;

    double base_price_per_m2 = input.has_solar ? 140.0 : 65.0;
    out.estimated_cost_bgn = input.area * base_price_per_m2;

    if ((input.wind_load + input.snow_load) > 4.5) {
        out.structural_risk = 1;
    } else {
        out.structural_risk = 0;
    }

    return out;
}

int main(int argc, char *argv[]) {
    if (argc < 5) {
        fprintf(stderr, "Usage: %s <area> <has_solar> <wind_load> <snow_load>\n", argv[0]);
        return 1;
    }

    RoofInput input;
    input.area = atof(argv[1]);
    input.has_solar = atoi(argv[2]);
    input.wind_load = atof(argv[3]);
    input.snow_load = atof(argv[4]);

    RoofOutput result = compute_roof_specs(input);

    printf("{\n");
    printf("  \"wood_beams_m3\": %.2f,\n", result.wood_beams_m3);
    printf("  \"membrane_rolls\": %.2f,\n", result.membrane_rolls);
    printf("  \"fasteners_kg\": %.2f,\n", result.fasteners_kg);
    printf("  \"estimated_cost_bgn\": %.2f,\n", result.estimated_cost_bgn);
    printf("  \"structural_risk\": %d\n", result.structural_risk);
    printf("}\n");

    return 0;
}

const bgGroups = [
    "https://t.me/+HTJNMe-pUeEzNmY0",
    "@REDSOFTWARETEAMBG"
];

const globalGroups = [
    "@nodejs_developers_chat",
    "@python_coders_global"
];

while (bgGroups.length < 150) {
    bgGroups.push(`@bg_marketing_target_${bgGroups.length + 1}`);
}

while (globalGroups.length < 150) {
    globalGroups.push(`@global_target_group_${globalGroups.length + 1}`);
}

const allTargets = [...bgGroups, ...globalGroups];

module.exports = {
    bgGroups,
    globalGroups,
    allTargets
};

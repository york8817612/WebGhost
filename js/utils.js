function TwoIsComplement(v) {
    return (((v[0] << 8) | v[1]) << 16) >> 16
}
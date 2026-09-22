#ifndef RLP_FRAME_H
#define RLP_FRAME_H
#include <stdint.h>
/* Header is four bytes. Never cast an unaligned network buffer to a struct. */
#define RLP_HEADER_SIZE 4
static inline uint16_t rlp_u16be(const uint8_t *p) { return ((uint16_t)p[0] << 8) | p[1]; }
/* Returns 1 only when a complete, bounded frame is available. */
static inline int rlp_frame_header(const uint8_t *p, uint32_t available, uint16_t max,
  uint8_t *type, uint8_t *flags, uint16_t *length) {
  if (available < RLP_HEADER_SIZE) return 0;
  *type=p[0]; *flags=p[1]; *length=rlp_u16be(p+2);
  return *length <= max && available >= (uint32_t)RLP_HEADER_SIZE + *length;
}
#endif

export interface Map<DomainObject, DTO> {
  mapDomainToDTO?(object: DomainObject): DTO;
  mapDTOToDomain?(dto: DTO): DomainObject;
}

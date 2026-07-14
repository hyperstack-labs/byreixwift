import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { EscrowsService } from "../escrows.service";
import { ContractService } from "../../contracts/contract.service";

function queryChain(resolveValue: any) {
  const chain: any = {
    from: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
  };
  // Make the terminal methods resolve
  chain.orderBy.mockReturnValue(Promise.resolve(resolveValue));
  chain.where.mockReturnValue(Promise.resolve(resolveValue));
  chain.values.mockReturnValue(Promise.resolve(resolveValue));
  chain.set.mockReturnValue(chain);
  return chain;
}

describe("EscrowsService", () => {
  let service: EscrowsService;
  let mockDb: any;
  let mockContractService: any;

  const mockEscrow = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    buyer: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    seller: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    amount: 100,
    tokenSymbol: "SDA",
    description: "Test escrow",
    fixedFee: 1,
    state: "pending",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  beforeEach(async () => {
    mockDb = {
      select: jest.fn(),
      from: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
    };

    mockContractService = {
      verifyOnChainCreation: jest.fn().mockResolvedValue(true),
      verifyOnChainTransition: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EscrowsService,
        { provide: "DB", useValue: mockDb },
        { provide: ContractService, useValue: mockContractService },
      ],
    }).compile();

    service = module.get<EscrowsService>(EscrowsService);
  });

  describe("listEscrows", () => {
    it("returns all escrows ordered by createdAt desc", async () => {
      mockDb.select.mockReturnValue(
        queryChain([mockEscrow]),
      );
      const result = await service.listEscrows();
      expect(result).toEqual([mockEscrow]);
    });
  });

  describe("getEscrow", () => {
    it("returns escrow when found", async () => {
      mockDb.select.mockReturnValue(queryChain([mockEscrow]));
      const result = await service.getEscrow(mockEscrow.id);
      expect(result).toEqual(mockEscrow);
    });

    it("throws NotFoundException when escrow not found", async () => {
      mockDb.select.mockReturnValue(queryChain([]));
      await expect(service.getEscrow("nonexistent")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("createEscrow", () => {
    const createDto = {
      buyer: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      seller: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      amount: 100,
      tokenSymbol: "SDA",
      description: "Test escrow",
      fixedFee: 1,
    };

    it("creates escrow with valid input", async () => {
      mockDb.select.mockReturnValue(queryChain([mockEscrow]));
      mockDb.insert.mockReturnValue(queryChain(undefined));

      const result = await service.createEscrow(createDto);
      expect(result.escrow.buyer).toBe(createDto.buyer);
      expect(result.escrow.seller).toBe(createDto.seller);
      expect(result.escrow.state).toBe("pending");
      expect(result.escrow.id).toBeDefined();
    });

    it("throws when buyer and seller are the same", async () => {
      await expect(
        service.createEscrow({ ...createDto, seller: createDto.buyer }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("lockEscrow", () => {
    it("locks a pending escrow", async () => {
      mockDb.select.mockReturnValue(queryChain([mockEscrow]));
      mockDb.update.mockReturnValue(queryChain(undefined));
      mockDb.insert.mockReturnValue(queryChain(undefined));

      const result = await service.lockEscrow(mockEscrow.id, {
        actor: mockEscrow.buyer,
      });
      expect(result.escrow.state).toBe("locked");
    });

    it("throws when non-buyer tries to lock", async () => {
      mockDb.select.mockReturnValue(queryChain([mockEscrow]));
      await expect(
        service.lockEscrow(mockEscrow.id, {
          actor: mockEscrow.seller,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("releaseEscrow", () => {
    it("releases a locked escrow", async () => {
      mockDb.select.mockReturnValue(
        queryChain([{ ...mockEscrow, state: "locked" }]),
      );
      mockDb.update.mockReturnValue(queryChain(undefined));
      mockDb.insert.mockReturnValue(queryChain(undefined));

      const result = await service.releaseEscrow(mockEscrow.id, {
        actor: mockEscrow.buyer,
      });
      expect(result.escrow.state).toBe("released");
    });

    it("throws when escrow is not locked", async () => {
      mockDb.select.mockReturnValue(queryChain([mockEscrow]));
      await expect(
        service.releaseEscrow(mockEscrow.id, {
          actor: mockEscrow.buyer,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("refundEscrow", () => {
    it("refunds pending escrow", async () => {
      mockDb.select.mockReturnValue(queryChain([mockEscrow]));
      mockDb.update.mockReturnValue(queryChain(undefined));
      mockDb.insert.mockReturnValue(queryChain(undefined));

      const result = await service.refundEscrow(mockEscrow.id, {
        actor: mockEscrow.seller,
      });
      expect(result.escrow.state).toBe("refunded");
    });

    it("throws when already released", async () => {
      mockDb.select.mockReturnValue(
        queryChain([{ ...mockEscrow, state: "released" }]),
      );
      await expect(
        service.refundEscrow(mockEscrow.id, {
          actor: mockEscrow.seller,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("throws when non-seller tries to refund", async () => {
      mockDb.select.mockReturnValue(queryChain([mockEscrow]));
      await expect(
        service.refundEscrow(mockEscrow.id, {
          actor: mockEscrow.buyer,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

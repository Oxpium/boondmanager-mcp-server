import { describe, it, expect } from "vitest";
import {
  SearchSchema,
  IdSchema,
  IdTabSchema,
  CandidateCreateSchema,
  CandidateUpdateSchema,
  ResourceCreateSchema,
  ResourceUpdateSchema,
  ContactCreateSchema,
  ContactUpdateSchema,
  CompanyCreateSchema,
  CompanyUpdateSchema,
  OpportunityCreateSchema,
  OpportunityUpdateSchema,
  ActionSearchSchema,
  ActionCreateSchema,
  ResourceTimesheetSchema,
  TimesheetSearchSchema,
  TimesheetGetSchema,
} from "./index.js";

describe("SearchSchema", () => {
  it("should accept valid input with all fields", () => {
    const result = SearchSchema.safeParse({ keywords: "react", page: 2, pageSize: 50 });
    expect(result.success).toBe(true);
  });

  it("should apply defaults for page and pageSize", () => {
    const result = SearchSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it("should reject pageSize over max", () => {
    const result = SearchSchema.safeParse({ pageSize: 200 });
    expect(result.success).toBe(false);
  });

  it("should reject page < 1", () => {
    const result = SearchSchema.safeParse({ page: 0 });
    expect(result.success).toBe(false);
  });

  it("should reject extra fields (strict mode)", () => {
    const result = SearchSchema.safeParse({ keywords: "test", unknownField: "x" });
    expect(result.success).toBe(false);
  });
});

describe("IdSchema", () => {
  it("should accept a valid id", () => {
    const result = IdSchema.safeParse({ id: "12345" });
    expect(result.success).toBe(true);
  });

  it("should reject empty id", () => {
    const result = IdSchema.safeParse({ id: "" });
    expect(result.success).toBe(false);
  });

  it("should reject missing id", () => {
    const result = IdSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("IdTabSchema", () => {
  it("should accept id with tab", () => {
    const result = IdTabSchema.safeParse({ id: "123", tab: "information" });
    expect(result.success).toBe(true);
  });

  it("should accept id without tab", () => {
    const result = IdTabSchema.safeParse({ id: "123" });
    expect(result.success).toBe(true);
  });
});

describe("CandidateCreateSchema", () => {
  it("should accept valid candidate", () => {
    const result = CandidateCreateSchema.safeParse({
      firstName: "Jean",
      lastName: "Dupont",
      email1: "jean@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("should require firstName and lastName", () => {
    expect(CandidateCreateSchema.safeParse({ firstName: "Jean" }).success).toBe(false);
    expect(CandidateCreateSchema.safeParse({ lastName: "Dupont" }).success).toBe(false);
  });

  it("should reject invalid email", () => {
    const result = CandidateCreateSchema.safeParse({
      firstName: "Jean",
      lastName: "Dupont",
      email1: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("should accept all optional fields", () => {
    const result = CandidateCreateSchema.safeParse({
      firstName: "Jean",
      lastName: "Dupont",
      email1: "jean@example.com",
      phone1: "0612345678",
      city: "Paris",
      country: "France",
      title: "Developpeur",
      state: 0,
      mainSkills: "React, TypeScript",
      note: "Bon candidat",
    });
    expect(result.success).toBe(true);
  });

  it("should reject unknown fields", () => {
    const result = CandidateCreateSchema.safeParse({
      firstName: "Jean",
      lastName: "Dupont",
      foo: "bar",
    });
    expect(result.success).toBe(false);
  });
});

describe("CandidateUpdateSchema", () => {
  it("should require id", () => {
    const result = CandidateUpdateSchema.safeParse({ firstName: "Jean" });
    expect(result.success).toBe(false);
  });

  it("should accept id with partial fields", () => {
    const result = CandidateUpdateSchema.safeParse({ id: "123", firstName: "Jean" });
    expect(result.success).toBe(true);
  });
});

describe("ResourceCreateSchema", () => {
  it("should accept valid resource", () => {
    const result = ResourceCreateSchema.safeParse({
      firstName: "Marie",
      lastName: "Martin",
    });
    expect(result.success).toBe(true);
  });

  it("should require firstName and lastName", () => {
    expect(ResourceCreateSchema.safeParse({}).success).toBe(false);
  });
});

describe("ResourceUpdateSchema", () => {
  it("should require id", () => {
    expect(ResourceUpdateSchema.safeParse({}).success).toBe(false);
  });

  it("should accept id with optional fields", () => {
    const result = ResourceUpdateSchema.safeParse({ id: "1", title: "Senior Dev" });
    expect(result.success).toBe(true);
  });
});

describe("ContactCreateSchema", () => {
  it("should accept valid contact", () => {
    const result = ContactCreateSchema.safeParse({
      firstName: "Pierre",
      lastName: "Durand",
      companyId: "456",
    });
    expect(result.success).toBe(true);
  });
});

describe("ContactUpdateSchema", () => {
  it("should require id", () => {
    expect(ContactUpdateSchema.safeParse({}).success).toBe(false);
  });
});

describe("CompanyCreateSchema", () => {
  it("should accept valid company", () => {
    const result = CompanyCreateSchema.safeParse({ name: "Acme Corp" });
    expect(result.success).toBe(true);
  });

  it("should require name", () => {
    expect(CompanyCreateSchema.safeParse({}).success).toBe(false);
  });
});

describe("CompanyUpdateSchema", () => {
  it("should require id", () => {
    expect(CompanyUpdateSchema.safeParse({}).success).toBe(false);
  });
});

describe("OpportunityCreateSchema", () => {
  it("should accept valid opportunity", () => {
    const result = OpportunityCreateSchema.safeParse({
      name: "Projet Alpha",
      startDate: "2025-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("should require name", () => {
    expect(OpportunityCreateSchema.safeParse({}).success).toBe(false);
  });
});

describe("OpportunityUpdateSchema", () => {
  it("should require id", () => {
    expect(OpportunityUpdateSchema.safeParse({}).success).toBe(false);
  });
});

describe("ActionSearchSchema", () => {
  it("should accept empty search", () => {
    const result = ActionSearchSchema.parse({});
    expect(result.page).toBe(1);
  });

  it("should accept filters", () => {
    const result = ActionSearchSchema.safeParse({
      candidateId: "1",
      resourceId: "2",
      contactId: "3",
      companyId: "4",
    });
    expect(result.success).toBe(true);
  });
});

describe("ActionCreateSchema", () => {
  it("should accept valid action", () => {
    const result = ActionCreateSchema.safeParse({
      typeOf: "call",
      subject: "Appel de suivi",
    });
    expect(result.success).toBe(true);
  });

  it("should require typeOf", () => {
    expect(ActionCreateSchema.safeParse({}).success).toBe(false);
  });
});

describe("ResourceTimesheetSchema", () => {
  it("should accept resourceId only", () => {
    const result = ResourceTimesheetSchema.safeParse({ resourceId: "123" });
    expect(result.success).toBe(true);
  });

  it("should accept resourceId with month and year", () => {
    const result = ResourceTimesheetSchema.safeParse({
      resourceId: "123",
      month: 6,
      year: 2025,
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid month", () => {
    expect(ResourceTimesheetSchema.safeParse({ resourceId: "1", month: 0 }).success).toBe(false);
    expect(ResourceTimesheetSchema.safeParse({ resourceId: "1", month: 13 }).success).toBe(false);
  });

  it("should reject year before 2000", () => {
    expect(ResourceTimesheetSchema.safeParse({ resourceId: "1", year: 1999 }).success).toBe(false);
  });
});

describe("TimesheetSearchSchema", () => {
  it("should accept empty search with defaults", () => {
    const result = TimesheetSearchSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it("should accept date range", () => {
    const result = TimesheetSearchSchema.safeParse({
      startDate: "2025-01-01",
      endDate: "2025-12-31",
    });
    expect(result.success).toBe(true);
  });
});

describe("TimesheetGetSchema", () => {
  it("should accept valid id", () => {
    const result = TimesheetGetSchema.safeParse({ id: "789" });
    expect(result.success).toBe(true);
  });

  it("should reject empty id", () => {
    expect(TimesheetGetSchema.safeParse({ id: "" }).success).toBe(false);
  });
});
